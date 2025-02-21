import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { lazyload } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import React from "react";

// Create singleton Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: "dx6oxmki4",
  },
});

const CloudImage = ({ publicId, ...props }) => {
  // Create image with specific transformations to prevent multiple resizing attempts
  const myImage = cld
    .image(publicId)
    .quality("auto:best")
    .format("auto")
    .delivery("q_auto:best")
    .resize(scale().width(500));

  return (
    <AdvancedImage
      cldImg={myImage}
      plugins={[lazyload()]}
      loading="lazy"
      className="w-100 h-100 object-fit-cover"
      onError={(e) => {
        e.target.style.display = "none";
      }}
      {...props}
    />
  );
};

export default React.memo(CloudImage);
