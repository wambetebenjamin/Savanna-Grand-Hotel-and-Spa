import Image, { type ImageProps } from "next/image";

// A tiny neutral inline placeholder keeps local photography from flashing while optimized images load.
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDY0IDQwIj48ZmlsdGVyIGlkPSJiIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2U4ZTRkZSIgZmlsdGVyPSJ1cmwoI2IpIi8+PC9zdmc+";

export default function HotelImage(props: ImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt ?? ""}
      placeholder={props.placeholder ?? "blur"}
      blurDataURL={props.blurDataURL ?? blurDataURL}
    />
  );
}
