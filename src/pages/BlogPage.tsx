import React from 'react';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogList } from '../components/blog/BlogList';
import './BlogPage.css';

export const BlogPage: React.FC = () => {
  return (
    <div className="blogpage-layout">
      {/* 1. Blog Hero Section */}
      <BlogHero />

      {/* 2. Blog Articles & Filtering */}
      <BlogList />
    </div>
  );
};

export default BlogPage;
