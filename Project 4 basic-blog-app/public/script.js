const API_URL = '';

let allPosts = [];
let currentPage = 1;
const postsPerPage = 5;

// DOM
const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const postIdInput = document.getElementById('postId');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const saveBtn = document.getElementById('saveBtn');
const addPostBtn = document.getElementById('addPostBtn');
const closeModal = document.querySelector('.close');

// Sidebar buttons
document.getElementById('allPostsBtn').addEventListener('click', fetchPosts);
addPostBtn.addEventListener('click', () => openModal());

// Modal
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.onclick = e => { if(e.target === modal) modal.style.display='none'; };

function openModal(post=null){
  modal.style.display='flex';
  if(post){
    modalTitle.textContent='Edit Post';
    postIdInput.value=post.id;
    titleInput.value=post.title;
    contentInput.value=post.content;
    saveBtn.textContent='Update Post';
  } else {
    modalTitle.textContent='Add New Post';
    postIdInput.value='';
    titleInput.value='';
    contentInput.value='';
    saveBtn.textContent='Save Post';
  }
}

// CRUD Functions
async function fetchPosts(){
  const res = await fetch(API_URL+'/posts');
  allPosts = await res.json();
  renderPosts();
}

function renderPosts(){
  const searchText = searchInput.value.toLowerCase();
  let filteredPosts = allPosts.filter(p =>
    p.title.toLowerCase().includes(searchText) || p.content.toLowerCase().includes(searchText)
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  currentPage = Math.min(currentPage, totalPages) || 1;
  const start = (currentPage-1)*postsPerPage;
  const end = start+postsPerPage;
  const postsToShow = filteredPosts.slice(start,end);

  postsContainer.innerHTML='';
  postsToShow.forEach(post=>{
    const div=document.createElement('div');
    div.className='post-card';
    div.innerHTML=`
      <p class="post-title">${post.title}</p>
      <p class="post-timestamp">${new Date(post.created_at).toLocaleString()}</p>
      <p class="post-content">${post.content}</p>
      <div class="actions">
        <button class="edit" onclick="editPost(${post.id})">Edit</button>
        <button class="delete" onclick="deletePost(${post.id})">Delete</button>
      </div>
    `;
    postsContainer.appendChild(div);
  });

  pageInfo.textContent=`Page ${currentPage} of ${totalPages || 1}`;
  prevBtn.disabled=currentPage===1;
  nextBtn.disabled=currentPage===totalPages||totalPages===0;
}

// Pagination
prevBtn.addEventListener('click',()=>{currentPage--;renderPosts();});
nextBtn.addEventListener('click',()=>{currentPage++;renderPosts();});

// Save Post
saveBtn.addEventListener('click', async ()=>{
  const id=postIdInput.value;
  const title=titleInput.value.trim();
  const content=contentInput.value.trim();
  if(!title||!content) return alert('Title and content required');

  if(id){
    await fetch(API_URL+'/posts/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content})});
  } else {
    await fetch(API_URL+'/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content})});
  }
  modal.style.display='none';
  fetchPosts();
});

// Edit & Delete
window.editPost=async id=>{
  const res=await fetch(API_URL+'/posts/'+id);
  const post=await res.json();
  openModal(post);
}
window.deletePost=async id=>{
  if(confirm('Delete this post?')){
    await fetch(API_URL+'/posts/'+id,{method:'DELETE'});
    fetchPosts();
  }
}

// Search
searchInput.addEventListener('input',renderPosts);

// Initial fetch
fetchPosts();
