import randomstring from "randomstring";
import { constants } from "../constants/common.js";
import { Url } from "../models/url.model.js";

export const generateShorterID = async () => {
  try {
    let generatedShortId = randomstring
      .generate({
        length: constants.SHORT_ID_LENGTH,
        charset: "alphanumeric",
      })
      .toString();

    while (true) {
      let existShortID = await Url.findOne({ shortId: generatedShortId });

      if (existShortID) {
        generatedShortId = randomstring
          .generate({
            length: constants.SHORT_ID_LENGTH,
            charset: "alphanumeric",
          })
          .toString();
      } else {
        break;
      }
    }

    return generatedShortId;
  } catch (error) {
    console.log(error);
    return false;
  }
};
