const { Select } = require("../databases/mysql/mysql-config");

exports.getDataWithImages = async (req, data1, data2, allImage = false) => {
  try {
    const { tablename, where, data, orders } = data1;
    const like = data1?.like || null;
    const { imagetable } = data2;
    let limit = null;
    if (data1.hasOwnProperty("limit")) {
      if (data1.limit !== null) {
        const offSet = data1.limit?.offSet;
        const noOfRecords = data1.limit?.noOfRecords;
        limit = { offSet, noOfRecords };
      }
    }

    const [getData, ___] = await Select(
      tablename,
      where,
      data,
      orders,
      limit,
      like
    );

    const newArr = [];
    let newResult = [];
    for (let i = 0; i < getData.length; i++) {
      const { pid } = getData[i];
      const [getImages, __0] = await Select(imagetable, "product__id=?", [pid]);

      let isNew = { is__new: true };
      const date1 = new Date(getData[i].create__date);
      const date2 = new Date();
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 40) isNew = { is__new: false };

      if (getImages.length !== 0) {
        const host = "http://" + req.headers.host + "/";
        newResult = {
          ...isNew,
          ...getData[i],
          imageSrc: host + getImages[0].url,
          altname: getImages[0].originalname,
        };

        if (allImage) {
          const images = getImages.map((item) => {
            const id = item.id;
            const url = host + item.url;
            const originalname = item.originalname;
            return { id, url, originalname };
          });
          newResult = { ...newResult, images };
        }
      } else {
        newResult = {
          ...getData[i],
          ...isNew,
          imageSrc: "",
          images: [],
        };
      }
      newArr.push(newResult);
    }

    return newArr;
  } catch (error) {
    console.error(error.message);
    return [];
  }
};
