const Notfound = () => {
  return (
    <div className="w-full min-h-svh flex flex-col items-center justify-center relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        }}
      />
      <h1 className="text-2xl md:text-5xl font-bold relative z-1 mb-4 bg-clip-text text-transparent bg-linear-to-r py-1 from-foreground/40 via-foreground to-foreground/40">
        404 | Page Not Found
      </h1>
      <p className="text-base md:text-xl text-muted-foreground relative z-1">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default Notfound;
