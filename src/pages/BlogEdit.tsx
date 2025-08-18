import { useParams } from 'react-router-dom';
import BlogForm from '@/components/BlogForm';

const BlogEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  return <BlogForm articleId={id} />;
};

export default BlogEdit;