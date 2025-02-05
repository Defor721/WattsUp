export default function BackgroundVideo() {
  return (
    <>
      <video
        src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" />
    </>
  );
}
