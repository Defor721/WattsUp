interface SlideNavigationProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

export default function SlideNavigation({
  totalSlides,
  currentSlide,
  onSlideChange,
}: SlideNavigationProps) {
  return (
    <div className="absolute bottom-12 flex justify-center space-x-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`h-4 w-4 rounded-full border-2 ${
            currentSlide === index ? "bg-white" : "border-white bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}
