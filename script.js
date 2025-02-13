
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
const discussionList = jsonLocalStorage.getItem("discussion") || agoraStatesDiscussions;

// index.html을 열어서 agoraStatesDiscussions 배열 요소를 확인하세요.
// console.log(discussionList);

// convertToDiscussion은 아고라 스테이츠 데이터를 DOM으로 바꿔줍니다.
const convertToDiscussion = (obj) => {
    // console.log(obj);
  const li = document.createElement("li"); // li 요소 생성
  li.className = "discussion__container"; // 클래스 이름 지정

  const avatarWrapper = document.createElement("div");
  avatarWrapper.className = "discussion__avatar--wrapper";
  const discussionContent = document.createElement("div"); 
  discussionContent.className = "discussion__content";
  const discussionAnswered = document.createElement("div");
  discussionAnswered.className = "discussion__answered";
  // TODO: 객체 하나에 담긴 정보를 DOM에 적절히 넣어주세요.

  const avatarImg = document.createElement('img');
  avatarImg.className = "discussion__avatar--image";
  avatarImg.alt = "avatar of " + obj.author;
  avatarImg.src = obj.avatarUrl;
  avatarWrapper.append(avatarImg);

  const contentTitle = document.createElement("h2");
  contentTitle.className = "discussion__title";
  const titleAnchor = document.createElement("a");
  titleAnchor.href = obj.url;
  titleAnchor.textContent = obj.title;
  contentTitle.append(titleAnchor);
  /*** 2-b.작성정보 ***/
  const contentInfo = document.createElement("div");
  contentInfo.className = "discussion__information";
  contentInfo.textContent = `${obj.author} / ${new Date(obj.createdAt).toLocaleString()}`;
  discussionContent.append(contentTitle, contentInfo);
  /*** 3.오른쪽 체크 표시 ***/
  const checked = document.createElement("p");
  checked.textContent = obj.answer ? "☑" : "☒";
  discussionAnswered.append(checked);


  li.append(avatarWrapper, discussionContent, discussionAnswered);
  return li;
};

// agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링하는 함수입니다.
const render = (element, pageNum) => {
  for (let i = 0; i < 10; i += 1) {
    element.append(convertToDiscussion(discussionList[i]));
  }
  if (pageNum) { // 페이지넘버를 눌렀을 때 이 부분이 없으면, 계속해서 쌓이면서 렌더링됩니다.
    element.innerHTML = "";
  }
  for (let i = pageNum * 10 - 10; i < Math.min(pageNum * 10, discussionList.length); i += 1) {
      element.append(convertToDiscussion(discussionList[i]));
  }
  return;
};

// ul 요소에 agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링합니다.
const ul = document.querySelector("ul.discussions__container");
render(ul);

const form = document.querySelector('.form');
const inputName = document.querySelector('.form__input--name > input');
const inputTitle = document.querySelector('.form__input--title > input');
const inputQuestion = document.querySelector('.form__textbox > textarea');
const formSubmit = document.querySelector(".form__submit > input");

//submit 버튼 활성화
formSubmit.addEventListener('click', (event) => {
    event.preventDefault(); 
    if (inputName.value != "" && inputTitle.value != "" && inputQuestion.value != "") {
    const Obj = {
        id: "999",
        createdAt: new Date(),
        title: inputTitle.value,
        url: "https://github.com/codestates-seb/agora-states-fe/discussions/45",
        author: inputName.value,//name 
        answer: null,
        bodyHTML:inputQuestion.value,
        avatarUrl:
          "https://avatars.githubusercontent.com/u/97888923?s=64&u=12b18768cdeebcf358b70051283a3ef57be6a20f&v=4",
      }
      //기존 데이터 가장 앞에 추가
      // discussionList.unshift(Obj);
      // ul.prepend(convertToDiscussion(Obj));
      // console.log(discussionList);

      // const notice = document.querySelector(".discussion__container");
      // notice.after(convertToDiscussion(Obj));
  
      // jsonLocalStorage.setItem("discussion", discussionList);

      inputName.value = '';
      inputTitle.value = '';
      inputQuestion.value = '';
    }
    else {
      alert('질문 내용을 입력해주세요.')
    }
})

//페이지네이션 1. 페이지 개수를 자동으로 만듭니다.
function paginationMaking() {
  if (discussionList) {
      for (let i = 1; i <= Math.ceil(discussionList.length / 10); i++) {
          const pageNum = document.createElement('span');
          const pagination = document.querySelector('.pagination__pagenum');
          pageNum.textContent = i;
          pageNum.className = `pagination__pagenum--num num${i}`;
          pagination.append(pageNum);
      }
  } else {
      for (let i = 1; i <= Math.ceil(agoraStatesDiscussions.length / 10); i++) {
          const pageNum = document.createElement('span');
          const pagination = document.querySelector('.pagination__pagenum');
          pageNum.textContent = i;
          pageNum.className = `pagination__pagenum--num num${i}`;
          pagination.append(pageNum);
      }
  }
}
paginationMaking(); //최초 실행

// 페이지네이션 3. 버튼을 누르면 해당 페이지에 10개씩 배열의 데이터를 화면에 렌더링합니다.
// querySelectorAll이 배열을 반환한다는 점에서 착안해, 두 개의 클래스를 미리 부여했습니다.
// 숫자 규칙을 따라서 반복문을 사용해, addEventListener를 동적으로 생성합니다.
let pageNumObject = {};
for (let i = 1; i <= document.querySelectorAll('.pagination__pagenum--num').length; i++) {
  pageNumObject[`num${i}`] = document.querySelector(`.num${i}`);
  pageNumObject[`num${i}`].addEventListener('click', () => {
      render(ul, pageNumObject[`num${i}`].textContent);
  });
}