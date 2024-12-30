"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card"; // ui ko structure karnnay k lyay use karain gy hum loog
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react"; //lucide icon library hy

interface WeatherData{   
    temperature: number,    
    description: string,
    location: string,
    unit: string,
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const trimmedLocation = location.trim(); // location k time par before and after agr space aay tou islyay trim lagain gy
        if(trimmedLocation === ""){
            setError("Please Enter a Valid Location.");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_AP_KEY}&q=${trimmedLocation}`
            );
            if(!response.ok){
                throw new Error("City not Found.");
            }
            const data = await response.json();
            const weatherData: WeatherData ={
                temperature: data.current.temp_c, // Get temperature in Celsius
                description: data.current.condition.text, // Get weather description
                location: data.location.name, // Get location name
                unit: "C", // Unit for temperature
            };
            setWeather(weatherData);            
        } catch(error){
                console.error("Error fetching weather data:", error);
                setError("City not Found. Please try again."); //Set error message
                setWeather(null); // Clear previous weather data
        } finally{
            setIsLoading(false);
        }
    };

    function getTemperatureMessage(temperature: number, unit: string): string{
        if(unit == "C"){
            if(temperature < 0){
                return `It's Freezing at ${temperature}°C. Bundle up!`;
            }else if(temperature < 10){
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            }else if(temperature < 20){
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
            }else if(temperature < 30){
                return `It's a pleasant ${temperature}°C. Enjoy the nice weather!.`;
            }else{
                return `It's hot at ${temperature}°C. Stay hydrated.`;
            }
        } else{
            //Placehold for other temperature units (e.g: Fahrenheit)
            return `${temperature}°${unit}`;
        }
    }

    function getWeatherMessage (description: string): string{
        switch(description.toLocaleLowerCase()){
            case "sunny":
                return "It's a beautiful sunny day!";
            case "partly cloudy":
                return "Expect some clouds and sunshine.";
            case "cloudy":
                return "It's cloudy today.";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "Don't forget your umbrella! It's raining.";
            case "thunderstorm":
                return "Thunderstorms are expected today.";
            case "snow":
                return "Bundle up! It's snowing.";
            case "mist":
                return "It's misty outside.";
            case "fog":
                return "Be careful, there's fog outside.";
            default:
                return description;    
        }
    }

    function getLocationMessage (location:string): string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6; // Determine if it's night time
        
        return `${location} ${isNight ? "at Night" : " During the Day"}`;
    }

    // JSX return statement rendering the weather widget UI
    return(
    <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md mx-auto text-center">
            <CardHeader>
                <CardTitle>Weather Widget</CardTitle>
                <CardDescription>
                    Search for the current Weather Conditions
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Form to input and submit the location */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input 
                type="text"
                placeholder="Enter a city name"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                     setLocation(e.target.value)} //agr user dosri location dalta hy tou islyay yay vala code likha hy
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Search"}{" "}
                </Button>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            {weather && (
                <div className="mt-4 grid gap-2">
                    {/* Display temperature message with icon */}
                    <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-6 h-6"/>
                        {getTemperatureMessage(weather.temperature, weather.unit)}
                    </div>
                    </div>
                    {/* Display weather description message with icon */}
                    <div className="flex items-center gap-2">
                        <CloudIcon className="w-6 h-6"/>
                        <div>{getWeatherMessage(weather.description)}</div>
                    </div>
                    {/* Display location message with icon */}
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6"/>
                        <div>{getLocationMessage(weather.location)}</div>
                    </div>
                </div>
                
            )}
            </CardContent>
              <h1 className="text-2xl text-center font-bold rounded-lg mb-8 m-7">
                Weather Widget By SHMUQ
              </h1>
        </Card>
    </div>
            
    )
}