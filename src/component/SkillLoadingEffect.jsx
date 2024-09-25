import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Complete from "./animation/Complete.json"
import { useState } from "react";

export default function SkillLoadingEffect({ onMouseDown }) {

  // const [animationComplete, setAnimationComplete] = useState(false);
const [sectorAngle, setSectorAngle] = useState(0);

 //  const skills = [
	// "Python🐍", "JavaScript", "React", "C++", "Java", "Rust🦀", "TailwindCss"
 //  ]

	const openingDuration = 1;
  const animationEffect = {
	initial: {
		opacity: 0,
		y: "100vh"
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			opacity: {type: "spring"},
			type: "tween",
			duration: openingDuration,
	  }
	},
	exit: {
	  opacity: 0, y: 50
	}
  }

  return (
	<motion.div
	  className="w-full h-full flex flex-col justify-center items-center my-4"
	  key="info"
	  variants={animationEffect}
	  initial="initial"
	  animate="animate"
	  exit="exit"
	  whileHover={{
	    cursor: "pointer",
	    boxShadow: "0 0 2em 0 rgba(245, 235, 132, 0.75)",
	  }}
	>
		<motion.div 
		className="absolute top-[10%] w-[20%] h-auto aspect-square rounded-full bg-red-500 clip-sector"
		onClick={() => {
			const adding = 180 - ((sectorAngle + 270) % 360);
			setSectorAngle(sectorAngle + adding)
		}}
		initial={{
			rotate: 0,
		}}
		animate={{
			rotate: sectorAngle + 270,
		}}
		  transition={{
			rotate: {
			  type: sectorAngle === 0 ? "tween" : "spring",
			  ease: "linear",
			  delay: sectorAngle === 0 ? openingDuration : 0
			}
		  }}
		onAnimationComplete={() => {
			if (180 === ((sectorAngle + 270)) % 360) {
				onMouseDown();
			}
		}}
		/>
		<motion.div 
		className="absolute top-[10%] w-[20%] h-auto aspect-square rounded-full bg-blue-100 clip-sector"
		initial={{
			rotate: 0,
		}}
		animate={{
			rotate: sectorAngle,
		}}
		  transition={{
			rotate: {
			  type: sectorAngle === 0 ? "tween" : "spring",
			  ease: "linear",
			  delay: sectorAngle === 0 ? openingDuration : 0
			}
		  }}
		onClick={() => {
			const adding = 180 - (sectorAngle % 360);
			setSectorAngle(sectorAngle + adding)}
		}
		/>
		<motion.div 
		className="absolute top-[10%] w-[20%] h-auto aspect-square rounded-full bg-green-100 clip-sector"
		initial={{
			rotate: 0,
		}}
		animate={{
			rotate: (sectorAngle + 90),
		}}
		  transition={{
			rotate: {
			  type: sectorAngle === 0 ? "tween" : "spring",
			  ease: "linear",
			  delay: sectorAngle === 0 ? openingDuration : 0
			}
		  }}
		onClick={() => {
			const adding = 180 - ((sectorAngle + 90) % 360);
			setSectorAngle(sectorAngle + adding)}
		}
		/>
		<motion.div 
		className="absolute top-[10%] w-[20%] h-auto aspect-square rounded-full bg-yellow-100 clip-sector"
		initial={{
			rotate: 0,
		}}
		animate={{
			rotate: (sectorAngle + 180),
		}}
		  transition={{
			rotate: {
			  type: sectorAngle === 0 ? "tween" : "spring",
			  ease: "linear",
			  delay: sectorAngle === 0 ? openingDuration : 0
			}
		  }}
		onClick={() => {
			const adding = 180 - ((sectorAngle + 180) % 360);
			setSectorAngle(sectorAngle + adding)}
		}
		/>

	</motion.div>
  )

}
