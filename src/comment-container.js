import {
  fetchData,
  getCommentsTree,
  getFromLocalStorage,
  storeInLocalStorage,
} from "./utils/comment-utilities.js";
import { CommentsList as commentsList } from "./components/comment-list.js";
import { CommentBox as commentBox } from "./components/comment-box.js";

export const CommentContainer = () => {
  const updateList = (comments, newComment, parentId) => {
    const findParent = (commentsList, newComment, parentId) => {
      commentsList.forEach((comment) => {
        if (comment.id === Number(parentId)) {
          comment.children.push(newComment);
        } else {
          findParent(comment.children, newComment, parentId);
        }
      });
    };
    findParent(comments, newComment, parentId);
    storeInLocalStorage("commentsList", comments);
    storeInLocalStorage("totalComments", newComment.id);
  };
  const addCommentContainer = (parentId) => {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("commentContainer");
    const newCommentButton = document.createElement("button");
    newCommentButton.innerHTML = "Add Comment";
    newCommentButton.setAttribute("data-parentId", parentId);
    const commentArea = document.createElement("textarea");
    commentArea.setAttribute("placeholder", "Enter comment here..");
    commentContainer.appendChild(commentArea);
    commentContainer.appendChild(newCommentButton);
    return commentContainer;
  };
  const addNewComment = (target) => {
    const message = target.parentNode.children[0].value;
    target.parentNode.children[0].value = "";
    const comments = getFromLocalStorage("commentsList");
    const totalComments = getFromLocalStorage("totalComments");
    const newComment = {
      id: totalComments + 1,
      message,
      parentId: null,
      children: [],
    };
    comments.push(newComment);
    storeInLocalStorage("commentsList", comments);
    storeInLocalStorage("totalComments", totalComments + 1);
    document.getElementsByClassName("repliesContainer")[0].innerHTML = "";
    document
      .getElementsByClassName("repliesContainer")[0]
      .appendChild(commentsList());
  };

  const addReplyBox = (target) => {
    const parentId = target.getAttribute("data-parentid");
    if (target.innerHTML === "Add Comment") {
      const message = target.parentNode.children[0].value;
      const comments = getFromLocalStorage("commentsList");
      const totalComments = getFromLocalStorage("totalComments");
      const newComment = {
        id: totalComments + 1,
        message,
        parentId: null,
        children: [],
      };
      updateList(comments, newComment, parentId);
      const replyUL = document.createElement("ul");
      replyUL.classList.add("replies");
      const replyLi = document.createElement("li");
      replyLi.appendChild(commentBox(newComment));
      if (target.closest(".reply").nextSibling) {
        target.closest(".reply").nextSibling.appendChild(replyLi);
      } else {
        replyUL.appendChild(replyLi);
        target.closest(".reply").parentNode.appendChild(replyUL);
      }
      target.parentElement.previousElementSibling.children[0].children[0].classList.remove("displayNone");
      target.parentNode.remove();
    } else {
      const replyBox = addCommentContainer(parentId);
      target.parentNode.parentNode.parentNode.appendChild(replyBox);
    }
  };

  const bindEvents = () => {
    document.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-parentid")) {
        const parentId = event.target.getAttribute("data-parentid");
        if (JSON.parse(parentId) == null) addNewComment(event.target);
        else {
          addReplyBox(event.target);
          event.target.classList.add("displayNone");
        }
      }
    });
  };

  bindEvents();

  const createMainContainer = () => {
    const finalDOMList = document.createElement("article");
    const mainTopicContainer = document.createElement("ul");
    mainTopicContainer.classList.add("topic");
    const topic = document.createElement("span");
    topic.innerHTML =
      "Capturing and bubbling allow us to implement one of most powerful event handling patterns called event delegation The idea is that if we have a lot of elements handled in a similar way, then instead of assigning a handler to each of them – we put a single handler on their common ancestor.In the handler we get event.target to see where the event actually happened and handle it. For more info visit https://javascript.info/event-delegation";
    mainTopicContainer.appendChild(topic);
    const commentContainer = addCommentContainer(null);
    mainTopicContainer.appendChild(commentContainer);
    const repliesContainer = document.createElement("article");
    repliesContainer.classList.add("repliesContainer");
    finalDOMList.appendChild(mainTopicContainer);
    finalDOMList.appendChild(repliesContainer);
    return finalDOMList;
  };

  const fetchComments = async () => {
    if (!getFromLocalStorage("commentsList")) {
      const comments = await fetchData();
      const updatedCommentsList = getCommentsTree(comments);
      storeInLocalStorage("commentsList", updatedCommentsList);
      storeInLocalStorage("totalComments", comments.length);
    }
    const topic = createMainContainer();
    document.getElementsByTagName("body")[0].appendChild(topic);
    document
      .getElementsByClassName("repliesContainer")[0]
      .appendChild(commentsList());
  };

  document.addEventListener("DOMContentLoaded", () => {
    fetchComments();
  });
};
