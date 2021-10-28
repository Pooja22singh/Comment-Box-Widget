import { CommentBox as commentBox } from "./comment-box.js";
import { getFromLocalStorage, storeInLocalStorage } from "../utils/comment-utilities.js";

export const CommentsList = () => {
  
  const createCommentList = (commentsList) => {
    const commentsListContainer = document.createElement("ul");
    commentsListContainer.classList.add("replies");
    commentsList.forEach((comment) => {
      const commentsList = document.createElement("li");
      const commentIndiv = commentBox(comment);
      commentsList.appendChild(commentIndiv);
      commentsListContainer.appendChild(commentsList);
      // if (comment.children.length > 0) {
        const childList = createCommentList(comment.children);
        commentsList.appendChild(childList);
        commentsListContainer.appendChild(commentsList);
      // }
    });
    return commentsListContainer;
  };
  const commentsList = getFromLocalStorage("commentsList");
  return createCommentList(commentsList);
};

