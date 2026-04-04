import { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import './AdminPlayerEdit.css';

export default function AdminPlayerEdit({ 
  player, 
  clubs, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    position: 'MIDFIELDER',
    nationality: 'Bangladeshi',
    current_club_id: '',
    fee: '',
    marketValue: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (player) {
      // Properly parse date - handle both formats
      let dateValue = '';
      if (player.date_of_birth) {
        // If it's a timestamp like "2002-01-01 00:00:00.0000000", extract just the date part
        const dateStr = player.date_of_birth.split(' ')[0] || player.date_of_birth;
        dateValue = dateStr;
      }
      
      setFormData({
        first_name: player.first_name || '',
        last_name: player.last_name || '',
        date_of_birth: dateValue,
        position: player.position || 'MIDFIELDER',
        nationality: player.nationality || 'Bangladeshi',
        current_club_id: player.club_id || player.current_club_id || '',
        fee: player.fee || '',
        marketValue: player.marketValue || player.market_value || '',
      });
      
      console.log('📥 Form data loaded for player:', player.first_name, player.last_name);
      console.log('   Date:', dateValue);
    }
  }, [player]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.date_of_birth || formData.date_of_birth.trim() === '') {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    if (!formData.position || formData.position.trim() === '') {
      newErrors.position = 'Position is required';
    }
    if (formData.marketValue && isNaN(parseFloat(formData.marketValue))) {
      newErrors.marketValue = 'Market value must be a number';
    }
    if (formData.fee && isNaN(parseFloat(formData.fee))) {
      newErrors.fee = 'Fee must be a number';
    }

    console.log('🔍 Validation check - errors found:', Object.keys(newErrors));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    console.log('Current formData:', formData);
    
    if (validateForm()) {
      console.log('✅ Validation passed, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('❌ Validation failed', errors);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={player ? 'Edit Player' : 'Add New Player'}>
      <form className="admin-player-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <FormInput
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
              required
              placeholder="Enter first name"
            />
            <FormInput
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
              required
              placeholder="Enter last name"
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Date of Birth"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth}
              required
            />
            <FormInput
              label="Nationality"
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="e.g., Bangladeshi"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Professional Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-select"
              >
                <option value="GOALKEEPER">Goalkeeper</option>
                <option value="DEFENDER">Defender</option>
                <option value="MIDFIELDER">Midfielder</option>
                <option value="FORWARD">Forward</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="current_club_id">Current Club</label>
              <select
                id="current_club_id"
                name="current_club_id"
                value={formData.current_club_id}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select a club</option>
                {clubs?.map(club => (
                  <option key={club.club_id} value={club.club_id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Financial Information</h3>
          <div className="form-row">
            <FormInput
              label="Transfer Fee (€)"
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              error={errors.fee}
              placeholder="Enter transfer fee"
              step="0.01"
              min="0"
            />
            <FormInput
              label="Market Value (€)"
              type="number"
              name="marketValue"
              value={formData.marketValue}
              onChange={handleChange}
              error={errors.marketValue}
              placeholder="Enter market value"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : player ? 'Update Player' : 'Add Player'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
