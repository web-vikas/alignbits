'use client'
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Component() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")

  const handleLanguageChange = (value) => {
    setLanguage(value)
    router.replace(`/customerInformation?lang=${value}`)
    
  }

  const handleNextStep = () => {
    // Here you would typically move to the next onboarding step
    console.log(`Selected language: ${language}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">Please select your preferred language to get started.</p>
          <Select onValueChange={handleLanguageChange} defaultValue={language}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleNextStep}>
            <GlobeIcon className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}