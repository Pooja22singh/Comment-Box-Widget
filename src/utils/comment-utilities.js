import { Comments } from "../data/comments.js";

const simulateCall = () => new Promise((resolve) => setTimeout(resolve, 100));

/**
 *
 * @returns
 */
export const fetchData = async () => {
  await simulateCall();
  return Comments;
};

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

export const getDateTimeString = (date) =>
  `${new Date(date).toDateString()} ${formatAMPM(new Date(date))}`;

export const getCommentsTree = (comments) => {
  const commentsMap = new Map();
  const finalArray = [];
  for (let i = 0; i < comments.length; i++) {
    commentsMap.set(comments[i].id, i);
  }
  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i];
    if (comment.parentId != null) {
      //find the index of the parent of the current node from the map
      //to push the current node in the children array of its parent
      comments[commentsMap.get(comment.parentId)].children.push(comment);
    } else finalArray.push(comment);
  }
  return finalArray;
};

/**
 * This method is used to convert an array with parent-child relationship into an array with tree structure
 * Receive an array with parent-child relationship as a parameter
 * Returns an array of tree structures
 */
export const getCommentsTreeRecursively = (data) => {
  //Data without parent node
  let parents = data.filter(
    (value) => value.parentId == "undefined" || value.parentId == null
  );

  //Data with parent node
  let childrens = data.filter(
    (value) => value.parentId !== "undefined" && value.parentId != null
  );

  //Define the concrete implementation of transformation method
  let translator = (parents, childrens) => {
    //Traverse parent node data
    parents.forEach((parent) => {
      //Traversal of child node data
      childrens.forEach((current, index) => {
        //At this time, find a child node corresponding to the parent node
        if (current.parentId === parent.id) {
          //Deep replication of sub node data is only supported here. For children's boots that don't know about deep replication, you can first learn about deep replication
          let temp = JSON.parse(JSON.stringify(childrens));
          //Let the current child node be removed from temp, which is the new data of child nodes. This is to make the number of iterations of child nodes less during recursion. The more layers of parent-child relationship, the more favorable
          temp.splice(index, 1);
          //Let the current child node be the only parent node to recursively find its corresponding child node
          translator([current], temp);
          //Put the found child node in the children attribute of the parent node
          typeof parent.childrens !== "undefined"
            ? parent.childrens.push(current)
            : (parent.childrens = [current]);
        }
      });
    });
  };

  // const nest = (items, id = null, link = 'parent_id') =>
  // items
  // .filter(item => item[link] === id)
  // .map(item => ({ ...item, children: nest(items, item.id) }));

  //Call transformation method
  translator(parents, childrens);

  //Return the final result
  return parents;
};

export const storeInLocalStorage = (key, value) => {
  if (window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key) => {
  if (window.localStorage) {
    return JSON.parse(window.localStorage.getItem(key));
  }
};
