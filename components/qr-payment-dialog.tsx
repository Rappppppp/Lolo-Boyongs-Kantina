import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { QrCode } from "lucide-react";
// import { DialogTitle } from "@headlessui/react";

export default function QrPaymentDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="cursor-pointer">
                    <QrCode className="h-5 w-5" />
                    Show QR Payment
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-full sm:max-w-5xl max-h-[95vh] overflow-y-auto p-6"
            >
                {/* Accessible title */}
                <DialogTitle>QR Payment</DialogTitle>

                <div className="grid md:grid-cols-2 gap-6">
                    <img
                        src="/resto/qr-gcash.jpg"
                        alt="GCash QR Payment"
                        className="w-full object-cover shadow-lg rounded-lg"
                    />

                    <img
                        src="/resto/qr-maya.jpg"
                        alt="Maya QR Payment"
                        className="w-full object-cover shadow-lg rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}