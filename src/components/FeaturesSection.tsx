import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Rocket, 
  Users, 
  BarChart3, 
  Clock,
  CheckCircle 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'AI-Powered Learning',
      description: 'Get personalized recommendations and intelligent code suggestions powered by advanced AI algorithms.',
      icon: Brain,
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      benefits: [
        'Smart code completion',
        'Personalized learning paths',
        'AI-driven problem recommendations'
      ]
    },
    {
      title: 'Secure Execution',
      description: 'Run code safely in our isolated sandbox environment with enterprise-grade security and resource management.',
      icon: Shield,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      benefits: [
        'Isolated sandbox environment',
        'Resource usage monitoring',
        'Enterprise-grade security'
      ]
    },
    {
      title: 'Lightning Fast',
      description: 'Experience instant code execution and real-time feedback with our optimized cloud infrastructure.',
      icon: Rocket,
      gradient: 'from-orange-500 via-red-500 to-orange-600',
      benefits: [
        'Sub-second execution times',
        'Real-time collaboration',
        'Cloud-optimized infrastructure'
      ]
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Learners' },
    { icon: BarChart3, value: '500K+', label: 'Code Executions' },
    { icon: Clock, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to master algorithms and data structures in one comprehensive platform.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="feature-card h-full relative"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Trusted by Developers Worldwide
            </h3>
            <p className="text-muted-foreground">
              Join our growing community of learners and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100
                  }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;