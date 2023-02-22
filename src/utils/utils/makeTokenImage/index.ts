/**
 *
 * @param imageData tokens image uri
 * @param tokenid tokens id for reference
 */
export const makeTokenImage = (
  imageData: string,
  tokenid: string
): string | undefined => {
  let imageUrl = undefined;
  try {
    var parser = new DOMParser();
    const doc = parser.parseFromString(imageData, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      console.error("Token does not contain an image", tokenid);
    } else {
      var imageString = doc.getElementsByTagName("artimage")[0].innerHTML;
      imageUrl = `data:image/jpeg;base64,${imageString}`;
    }

    return imageUrl;
  } catch (err) {
    console.error(`Failed to create image data ${tokenid}`, err);
  }

  return undefined;
};

export default makeTokenImage;
