import { RequestHandler } from "express";
import { User } from "../model/userModel";
import { swapByReference } from "../utils/helper";
import { AppError } from "../utils/AppError";

export const addLink: RequestHandler = async (request, response, next) => {
  try {
    const id = request.params.id;
    const { platform, URL, order } = request.body;

    const newLinkItem = {
      platform,
      URL,
      order,
    };

    const updatedLinkList = await User.updateOne(
      { _id: id },
      { $push: { linkList: newLinkItem } },
      { runValidators: true }
    );

    response.status(200).send({
      status: "success",
      data: updatedLinkList,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLink: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.params.id;
    const deleteId = request.body.deleteId;
    console.log(userId, deleteId);

    const deleted = await User.updateOne(
      { _id: userId },
      { $pull: { linkList: { _id: deleteId } } }
    );

    response.status(200).send({
      status: "success",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

export const getLink: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.params.id;
    const link = await User.find({ _id: userId }).select("linkList");
    response.status(200).send({
      status: "success",
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLink: RequestHandler = async (request, response, next) => {
  try {
    const query = request.query;
    const userId = request.params.id;
    const toBeUpdated = request.body;

    // Swapping is done by using javascript then saving it to the database.
    // Usage : /links/:id?swap=index1+index2
    if (query.swap) {
      // 0. Retrieve User from database
      const user = await User.findById(userId);
      if (!user) throw new AppError("User does not exist", 404);

      //1. Retrieve Index from string
      const [index1, index2] = (query.swap as string)
        .replace("+", " ")
        .split(" ");

      //2. Swap the user array by reference
      swapByReference<string>(user.linkList, +index1, +index2);

      // 3. Save changes to database
      user.markModified("linkList");
      await user.save({ validateBeforeSave: false });

      // 4. Send success response to user
      response.status(200).send({
        status: "succcess",
      });

      return;
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: toBeUpdated },
      { new: true }
    );
    response.status(200).send({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
