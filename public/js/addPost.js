const submitPost = async (event) => {
    console.log('Somebody clicked the submit poem button');
  
    event.preventDefault();
  
    const text_input = document.querySelector('#fragment').value.trim();
  
    if (text_input) {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title, post_url }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert(response.statusText);
      }
    }
  };
  
  document
    .querySelector('#post-form')
    .addEventListener('submit', submitPost);
  