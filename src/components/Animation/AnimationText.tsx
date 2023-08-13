import { motion } from "framer-motion";

const AnimationText = () => {
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        >
        <h1>Animation Text</h1>
        </motion.div>
    );
}

export default AnimationText;
