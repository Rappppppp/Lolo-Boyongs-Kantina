import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function MapDialog() {
    const [streetView, setStreetView] = useState(false);

    const mapSrc = streetView
        ? "https://www.google.com/maps/embed?pb=!4v1764728863871!6m8!1m7!1swEO__uTsH1qlPOLQao09LA!2m2!1d14.28102902226473!2d121.4161058190923!3f29.781769!4f0!5f0.7820865974627469"
        : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123740.27886220814!2d121.12838740941358!3d14.260026599429095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397e389a77cef07:0xcb208b11d66e89ed!2sLolo%20boyong's%20kantina!5e0!3m2!1sen!2sph!4v1764726883893!5m2!1sen!2sph";

    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="cursor-pointer">
                    <MapPin className="h-5 w-5" />
                    View Maps
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-full sm:max-w-5xl max-h-[95vh] overflow-y-auto p-6"
            >
                {/* Accessible title */}
                <DialogTitle>Our Location</DialogTitle>

                <div className="relative w-full h-[60vh] rounded-lg overflow-hidden shadow-lg mb-4">
                    <iframe
                        src={mapSrc}
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setStreetView(!streetView)}
                    >
                        {streetView ? "Switch to Map View" : "Switch to Street View"}
                    </Button>

                    <Button
                        asChild
                        variant="secondary"
                    >
                        <a
                            href="https://www.google.com/maps/place/Lolo+boyong's+kantina/@14.281029,121.4161058,12z/data=!4m14!1m7!3m6!1s0x3397e389a77cef07:0xcb208b11d66e89ed!2sLolo+boyong's+kantina!8m2!3d14.2814457!4d121.4163544!16s%2Fg%2F11lfqr0ctc!3m5!1s0x3397e389a77cef07:0xcb208b11d66e89ed!8m2!3d14.2814457!4d121.4163544!16s%2Fg%2F11lfqr0ctc?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in Google Maps
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    );
}
