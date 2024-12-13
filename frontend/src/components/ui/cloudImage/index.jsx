import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

import { lazyload, responsive } from "@cloudinary/react";
const CloudImage = ({ publicId }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dx6oxmki4",
    },
  });

  const myImage = cld.image(publicId).quality("auto:best").format("auto").delivery("q_auto:best");

  return <AdvancedImage cldImg={myImage} plugins={[responsive(), lazyload()]} />;
};

export default CloudImage;
