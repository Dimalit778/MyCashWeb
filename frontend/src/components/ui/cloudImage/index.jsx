import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

import { lazyload, responsive } from "@cloudinary/react";
const CloudImage = ({ publicId }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dx6oxmki4",
    },
  });
  console.log(publicId);
  const myImage = cld.image(publicId);

  return <AdvancedImage cldImg={myImage} plugins={[responsive(), lazyload()]} />;
};

export default CloudImage;
