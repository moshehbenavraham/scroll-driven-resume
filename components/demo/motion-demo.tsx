"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function MotionDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Framer Motion</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-3"
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-16 w-16 rounded-lg bg-primary/20 flex items-center justify-center cursor-pointer"
            >
              <span className="text-xl font-bold text-primary">{i}</span>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-4 text-sm text-muted-foreground">
          Staggered entry animation with hover/tap interactions.
        </p>
      </CardContent>
    </Card>
  );
}
