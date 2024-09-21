import formatDateToFrontend, { getStorage } from "./helper.js";
import { getComments, getNewsBySlug, postComments } from "./request.js";

const viewContainer = document.querySelector("#viewContainer");
const commentContainer = document.querySelector("#commentContainer");
const commentForm = document.querySelector("#commentForm");
const textComment = document.querySelector("#textComment");

const storage = getStorage("slug");
let id = false;

async function createViewUI(slug) {
  const viewData = await getNewsBySlug(slug);

  viewContainer.innerHTML = `<div>
                <span class="mr-8">Tech</span> <span>Mobile</span>
              <p class="text-opacity-60 mt-32 text--xl">
                Samsung's next Unpacked event reportedly lands August 11 
              </p>
              <figure class="mt-32 img-3xl">
                <img class="img" src=${viewData?.photo} alt="" />
              </figure>
              <div class="text-opacity-60 mt-32 text--xl">
                <p class="mt-32">
                  Samsung had a pretty quiet Mobile World Congress event, but it
                  did tell us we’d learn more about its upcoming Google-approved
                  smartwatch at its next Unpacked event. Unfortunately, the
                  company didn’t tell us when exactly that would be, but a new
                  report from Korean publication DigitalDaily News (via
                  9to5Google) claims the next Unpacked will take place on August
                  11, at 10 AM ET.
                </p>
                <p class="mt-32">
                  According to the report, Samsung will be launching five
                  devices at the event:
                </p>
                <ul class="mt-32 ml-32">
                  <li class="mb-16 telephone-type">Galaxy Z Fold 3</li>
                  <li class="mb-16 telephone-type">Galaxy Z Flip 3</li>
                  <li class="mb-16 telephone-type">Galaxy Watch 4</li>
                  <li class="mb-16 telephone-type">Galaxy Watch 4 Active</li>
                  <li class="mb-16 telephone-type">Galaxy Buds 2</li>
                </ul>
                <p>
                  Notably, the new Galaxy Watches will be Samsung’s first to not
                  use Tizen OS. Google collaborated with Samsung to revamp Wear
                  OS from the ground up, making it smoother and more efficient.

                  <br />
                  <br />
                  Hopefully, the devices are able to maintain the long battery
                  life Samsung’s smartwatches have been known for, while having
                  much greater compatibility with smartwatch apps via Wear OS.
                  That said, the watch will use a custom One UI Watch skin —
                  because it wouldn’t be Samsung if it didn’t put its own twist
                  on the software.
                  <br />
                  <br />
                  As for the Z Fold 3, it’s expected to be a refinement of the
                  original Fold’s concept without major changes to the form
                  factor. The biggest change aside from the expected spec bump
                  is that the Z Fold 3 will support the S-Pen.
                  <br />
                  <br />
                  The event will reportedly be broadcast via YouTube, as per
                  usual, and there is no indication the company plans to hold a
                  concurrent physical event. With the rumored date a little over
                  a month away, I’d expect an official announcement from Samsung
                  within the next week or two.
                </p>
              </div>
              <!-- add your comment -->
              <div class="flex flex-column alingItems mt-32 text--xxs">
                <p class="mb-16 text-opacity-30">
                  Published July 5, 2021 - 8:16 pm IST
                </p>
                <p class="mb-32">by John Abraham</p>
                <button class="back-btn">Back to top</button>
              </div>
              </div>`;

  createCommentUI(viewData.id);
  id = viewData.id;
}

createViewUI(storage);

async function createCommentUI(id) {
  const userId = getStorage("userid");
  const comments = await getComments(id);
  const html = comments
    .map((c) => {
      return `  <div>
                  <div class="flex justifyBetween mb-16">
                    <div>
                      <p class="comment-name text--xl font--500">
                        ${c.user.name}
                      </p>
                    </div>
                    <div>
                      <i class="fa-regular fa-thumbs-up icon--sm"></i>
                      <i class="fa-regular fa-thumbs-down icon--sm ml-16"></i>
                    </div>
                  </div>
                  <p class="text--xl">
                   ${c.body}
                  </p>
                  <div class="flex justifyBetween">
                    <p class="text-opacity-30 text--xxs mt-16">
                      Posted ${formatDateToFrontend(c.created_at)}
                    </p>
                   ${
                     c.user.id == userId
                       ? ` <div class="trash flex alingItems mt-16">
                      <i class="fa-solid fa-trash-can icon--xs"></i>
                      <p class="ml-16 text--xxs">Delete Comment</p>
                    </div>`
                       : ""
                   }
                  </div>
                </div>`;
    })
    .join("");

  commentContainer.innerHTML = html;
}

const comment = {};

textComment.addEventListener(
  "input",
  (e) => (comment["body"] = e.target.value)
);

async function sendComment(e) {
  e.preventDefault();

  const commentRes = await postComments(id, comment);
  console.log(commentRes);
}

commentForm.addEventListener("submit", (e) => sendComment(e));
