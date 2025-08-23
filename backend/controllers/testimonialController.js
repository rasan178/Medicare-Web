const Testimonial = require('../models/Testimonial');

// Get all approved testimonials for public display
exports.getPublicTestimonials = async (req, res) => {
  try {
    console.log('Fetching public testimonials...');
    
    const testimonials = await Testimonial.find({
      isApproved: true,
      isVisible: true
    })
    .select('fullName profession rating comment createdAt')
    .sort({ createdAt: -1 })
    .limit(20);

    console.log(`Found ${testimonials.length} approved testimonials`);

    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    console.log('Creating new testimonial with data:', req.body);
    
    const { fullName, profession, rating, comment } = req.body;

    // Validation
    if (!fullName || !rating || !comment) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Full name, rating, and comment are required'
      });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      console.log('Validation failed: Invalid rating');
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    if (comment.length > 1000) {
      console.log('Validation failed: Comment too long');
      return res.status(400).json({
        success: false,
        message: 'Comment must be less than 1000 characters'
      });
    }

    if (fullName.length > 100) {
      console.log('Validation failed: Name too long');
      return res.status(400).json({
        success: false,
        message: 'Full name must be less than 100 characters'
      });
    }

    if (profession && profession.length > 100) {
      console.log('Validation failed: Profession too long');
      return res.status(400).json({
        success: false,
        message: 'Profession must be less than 100 characters'
      });
    }

    const testimonial = new Testimonial({
      fullName: fullName.trim(),
      profession: profession ? profession.trim() : '',
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: false // Default to not approved for moderation
    });

    console.log('Saving testimonial...');
    await testimonial.save();
    console.log('Testimonial saved successfully with ID:', testimonial._id);

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be reviewed and published soon.',
      testimonial: {
        id: testimonial._id,
        fullName: testimonial.fullName,
        profession: testimonial.profession,
        rating: testimonial.rating,
        comment: testimonial.comment,
        createdAt: testimonial.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate testimonial detected'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Admin functions
exports.getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    
    if (status === 'approved') {
      filter.isApproved = true;
    } else if (status === 'pending') {
      filter.isApproved = false;
    }

    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Testimonial.countDocuments(filter);

    res.json({
      success: true,
      testimonials,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Approve testimonial
exports.approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID'
      });
    }
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial
    });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID'
      });
    }
    
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Toggle testimonial visibility
exports.toggleTestimonialVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID'
      });
    }
    
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.isVisible = !testimonial.isVisible;
    await testimonial.save();

    res.json({
      success: true,
      message: `Testimonial ${testimonial.isVisible ? 'shown' : 'hidden'} successfully`,
      testimonial
    });
  } catch (error) {
    console.error('Error toggling testimonial visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonial visibility',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};