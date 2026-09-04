import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../../hooks/useBlogs';
import { getUploadUrl } from '../../utils/image';
import fallbackImage from '../../assets/wheat-sunburst.jpg';

const formatBlogDate = (date: string) => {
  if (!date) return 'Recently published';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const HomeLatestNews: React.FC = () => {
  const { data, isLoading } = useBlogs({ status: 'PUBLISHED', sortBy: 'newest', limit: 5 });
  const posts = data?.blogs || [];
  const featuredPosts = posts.slice(0, 2);
  const compactPosts = posts.slice(2, 5);

  if (!isLoading && posts.length === 0) return null;

  return (
    <section id="news" className="agriflow-news-section" aria-labelledby="home-latest-news-title">
      <div className="container">
        <div className="agriflow-news-header">
          <h2 id="home-latest-news-title" className="agriflow-news-title">Our Latest News</h2>
          <Link to="/blog" className="agriflow-news-btn-more">More Blogs</Link>
        </div>

        {isLoading ? (
          <div className="agriflow-news-loading" aria-label="Loading latest articles">
            {Array.from({ length: 3 }).map((_, index) => <span key={index} />)}
          </div>
        ) : (
          <div className="agriflow-news-grid">
            {featuredPosts.map((post) => {
              const href = `/blog/${post.slug || post.id}`;
              const image = getUploadUrl(post.featuredImage, fallbackImage);
              return (
                <article className="agriflow-featured-news-card" key={post.id}>
                  <Link to={href} className="agriflow-news-img-box" aria-label={`Read ${post.title}`}>
                    <img src={image} alt={post.title} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                    <span className="agriflow-news-badge">{post.category || 'Agriculture'}</span>
                  </Link>
                  <div className="agriflow-news-meta">
                    <span className="agriflow-news-meta-item"><User size={14} /> By {post.author || 'Agri Expert'}</span>
                    <span className="agriflow-news-meta-item"><Calendar size={14} /> {formatBlogDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h3 className="agriflow-news-heading"><Link to={href}>{post.title}</Link></h3>
                  <Link to={href} className="agriflow-news-btn-read">Read More</Link>
                </article>
              );
            })}

            {compactPosts.length > 0 && (
              <div className="agriflow-news-column-stacked">
                {compactPosts.map((post) => {
                  const href = `/blog/${post.slug || post.id}`;
                  const image = getUploadUrl(post.featuredImage, fallbackImage);
                  return (
                    <Link to={href} className="agriflow-news-compact-item" key={post.id}>
                      <div className="agriflow-news-compact-img-wrap">
                        <img src={image} alt={post.title} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
                      </div>
                      <div className="agriflow-news-compact-content">
                        <div className="agriflow-news-meta">
                          <span className="agriflow-news-meta-item"><User size={13} /> By {post.author || 'Agri Expert'}</span>
                          <span className="agriflow-news-meta-item"><Calendar size={13} /> {formatBlogDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <h4 className="agriflow-news-compact-heading">{post.title}</h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeLatestNews;
