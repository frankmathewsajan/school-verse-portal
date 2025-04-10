
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 dark:from-primary/20 dark:to-background -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Welcome to <span className="text-primary">SchoolVerse</span> Academy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Empowering students through innovative education and comprehensive learning experiences. 
              Discover a vibrant community dedicated to academic excellence.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/gallery">
                  Explore Gallery
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-xl animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Students learning together"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Inspiring Tomorrow's Leaders</h3>
              <p className="mb-0">Building character, creativity, and excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
