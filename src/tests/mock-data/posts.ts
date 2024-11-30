const newPostPayload = {
  body: 'New post body',
  title: 'New post title',
};

const post = {
  id: 183,
  body: 'Was a sensory overload of colors, sounds, and scents. Vendors called out their wares, and the crowd moved in a vibrant dance. Fresh produce, handmade crafts, and exotic spices filled the stalls, each one a testament to the rich culture and community spirit.',
  title: 'The bustling marketplace',
  userId: 2,
};

// https://dummyjson.com/posts/user/2
const posts = [
  {
    id: 183,
    body: 'Was a sensory overload of colors, sounds, and scents. Vendors called out their wares, and the crowd moved in a vibrant dance. Fresh produce, handmade crafts, and exotic spices filled the stalls, each one a testament to the rich culture and community spirit.',
    title: 'The bustling marketplace',
    userId: 2,
  },
  {
    id: 218,
    body: 'Neon lights flashed, and the air was thick with the scent of street food cooking on open grills. Pedestrians jostled for space on crowded sidewalks, their voices blending into a vibrant symphony of urban life. It was a place where every corner held a new adventure, where the pulse of the city could be felt in every heartbeat.',
    title: 'The bustling city street was a feast for the senses',
    userId: 2,
  },
];

const editPostPayload = {
  id: 1,
  body: 'New post body',
  title: 'New post title',
};

export { editPostPayload, newPostPayload, post, posts };
