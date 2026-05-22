//  import { motion } from "framer-motion";
//  import { Button } from "@/components/ui/button";
//  import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
//  import { appConfig } from "@/config/app.config";
// import Link from "next/link";
 
//  const HeroSection = () => {
//    return (
//      <section className="relative min-h-screen overflow-hidden">
//        {/* Background image with overlay */}
//        <div className="absolute inset-0">
//          <img
//            src='/resto/5.jpg'
//            alt="Lolo Boyong's Kantina"
//            className="w-full h-full object-cover"
//          />
//          <div className="absolute inset-0 bg-gradient-to-b from-warm-brown/80 via-warm-brown/70 to-warm-brown/90" />
//        </div>
 
//        {/* Decorative elements */}
//        <div className="absolute inset-0 overflow-hidden pointer-events-none">
//          <motion.div
//            initial={{ opacity: 0, scale: 0.8 }}
//            animate={{ opacity: 0.15, scale: 1 }}
//            transition={{ duration: 2, ease: "easeOut" }}
//            className="absolute -top-20 -left-20 w-96 h-96 bg-terracotta rounded-full blur-3xl"
//          />
//          <motion.div
//            initial={{ opacity: 0, scale: 0.8 }}
//            animate={{ opacity: 0.1, scale: 1 }}
//            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
//            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gold rounded-full blur-3xl"
//          />
//        </div>
 
//        {/* Content */}
//        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex items-center min-h-screen">
//          <div className="w-full max-w-3xl">
//            <motion.div
//              initial={{ opacity: 0, y: 30 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ duration: 0.8, ease: "easeOut" }}
//              className="space-y-6 mb-12"
//            >
//              <motion.span
//                initial={{ opacity: 0 }}
//                animate={{ opacity: 1 }}
//                transition={{ delay: 0.3 }}
//                className="inline-block text-gold font-medium tracking-widest uppercase text-sm"
//              >
//                Family Restaurant Since 2019
//              </motion.span>
//              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-primary-foreground leading-[1.1]">
//                Welcome to{" "}
//                <span className="text-terracotta block mt-2">
//                  {appConfig.name}
//                </span>
//              </h1>
//              <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-xl font-light leading-relaxed">
//                Experience authentic Filipino home-cooked meals crafted with love
//                and tradition, just like Lolo Boyong used to make.
//              </p>
//            </motion.div>
 
//            <motion.div
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ duration: 0.6, delay: 0.4 }}
//              className="flex flex-col sm:flex-row gap-4"
//            >
//              <Dialog>
//                <DialogTrigger asChild>
//                  <Button size="lg" variant="hero" className="text-lg cursor-pointer">
//                    View Featured Menu
//                  </Button>
//                </DialogTrigger>
//                <DialogContent className="w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto">
//                  <DialogTitle className="font-display text-2xl">Featured Menu</DialogTitle>
//                  <img
//                    src='/resto/featured-menu.jpg'
//                    alt="Featured Menu"
//                    className="w-full object-cover rounded-lg"
//                  />
//                </DialogContent>
//              </Dialog>
 
//              <Button
//                size="lg"
//                variant="heroOutline"
//                className="text-lg"
//                asChild
//              >
//                <Link href="/reservations">Reserve a Table</Link>
//              </Button>
//            </motion.div>
//          </div>
//        </div>
 
//        {/* Scroll indicator */}
//        <motion.div
//          initial={{ opacity: 0 }}
//          animate={{ opacity: 1 }}
//          transition={{ delay: 1.5 }}
//          className="absolute bottom-8 left-1/2 -translate-x-1/2"
//        >
//          <motion.div
//            animate={{ y: [0, 10, 0] }}
//            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
//            className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2"
//          >
//            <motion.div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
//          </motion.div>
//        </motion.div>
//      </section>
//    );
//  };
 
//  export default HeroSection;