export const ShineButton = ({ className = "", children, ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full border border-modern-calm-ink-black/40 px-5 py-2.5 bg-[linear-gradient(120deg,#0d1b2a,#1b263b,#415a77,#0d1b2a)] bg-size-[320%_100%] text-white font-semibold shadow-md animate-shine transition-shadow duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-modern-calm-dusk-blue dark:border-modern-calm-alabaster-grey/30 dark:text-modern-calm-alabaster-grey dark:bg-[linear-gradient(120deg,#0d1b2a,#1b263b,#415a77,#0d1b2a)] ${className}`}
    >
      {children}
    </button>
  );
};

export default ShineButton;
