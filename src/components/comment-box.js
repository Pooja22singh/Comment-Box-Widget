export const CommentBox = (comment) => {
  const commentBox = document.createElement("div");
  commentBox.classList.add("reply");
  const message = document.createElement("span");
  message.innerHTML = comment.message;
  message.classList.add("message");
  const otherDetails = document.createElement("div");
  otherDetails.classList.add("replyIcon");
  const replyButton = document.createElement("button");
  const replyIcon = document.createElement("i");
  replyIcon.classList.add("fa", "fa-reply");
  replyIcon.setAttribute("data-parentId", comment.id);
  replyButton.appendChild(replyIcon);
  commentBox.appendChild(message);
  otherDetails.appendChild(replyButton);
  commentBox.appendChild(otherDetails);
  return commentBox;
};
