import { motion } from 'framer-motion';
import { 
  TreePine, 
  GitBranch, 
  Layers, 
  Shuffle, 
  Target, 
  Zap, 
  ArrowRight,
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DSATopicsPreview = () => {
  const topics = [
    {
      title: 'Arrays & Strings',
      description: 'Master fundamental data structures with practical examples',
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      problems: 45,
    },
    {
      title: 'Trees & Graphs',
      description: 'Navigate complex hierarchical and connected data structures',
      icon: TreePine,
      color: 'from-green-500 to-teal-500',
      problems: 38,
    },
    {
      title: 'Dynamic Programming',
      description: 'Solve optimization problems with efficient algorithms',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      problems: 32,
    },
    {
      title: 'Sorting & Searching',
      description: 'Learn efficient techniques for data organization and retrieval',
      icon: Shuffle,
      color: 'from-orange-500 to-red-500',
      problems: 28,
    },
    {
      title: 'Linked Lists',
      description: 'Understand linear data structures and pointer manipulation',
      icon: GitBranch,
      color: 'from-indigo-500 to-purple-500',
      problems: 24,
    },
    {
      title: 'Advanced Algorithms',
      description: 'Tackle complex algorithmic challenges and optimizations',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      problems: 19,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="topics">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Learn <span className="text-gradient">DSA Topics</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Master data structures and algorithms with our comprehensive topic-based learning approach.
            Each topic includes theory, examples, and hands-on practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <motion.div
                key={topic.title}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="topic-card group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  {/* Icon Background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{topic.problems} Problems</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers mastering algorithms and data structures with our interactive platform.
            </p>
            <Button className="hero-button" asChild>
              <Link to="/topics">
                Explore All Topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DSATopicsPreview;