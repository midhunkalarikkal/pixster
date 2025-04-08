import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { validateCaption } from '../utils/validator';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [captionError, setCaptionError] = useState(null);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
    const error = validateCaption(event.target.value);
    setCaptionError(error); // Validate on change
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.info('Please select an image.');
      return;
    }

    const error = validateCaption(caption);
    setCaptionError(error);

    if (error) {
      return; // Prevent submission if there's a caption error
    }

    setUploading(true);
    try {
      console.log('Uploading image:', image);
      console.log('Caption:', caption);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Post created successfully!');
      setCaption('');
      setImage(null);
      setImagePreview('');
      setCaptionError(null); // Clear any previous error
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-8 h-screen">
      <div className='p-6 rounded-lg shadow-md w-8/12'>
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Image Preview" className="max-h-48 rounded-md object-cover" />
              </div>
            )}
          </div>

          {/* Caption Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Caption</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-24 max-h-96 ${captionError ? 'textarea-error' : ''}`}
              placeholder="Write your caption here, not more than 200 characters"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>
            {captionError && (
              <label className="label">
                <span className="label-text-alt text-error">{captionError}</span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-neutral w-full ${uploading ? 'loading' : ''}`}
            disabled={uploading || captionError}
          >
            <ImagePlus className="mr-2" size={20} />
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;