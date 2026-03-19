'use client';

import { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Card, 
  CardContent, Box, Select, MenuItem, FormControl, 
  InputLabel, Slider, CircularProgress, Alert, IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from '@apollo/client';
import { GET_VOICES, CREATE_VOICE, DELETE_VOICE } from '../graphql/queries';

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: string;
  previewUrl?: string;
}

export default function Home() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState(1);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useQuery(GET_VOICES);
  const [createVoice] = useMutation(CREATE_VOICE);
  const [deleteVoice] = useMutation(DELETE_VOICE);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return;
    }
    if (!selectedVoice) {
      setError('Please select a voice');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Simulate voice generation (in real app, call TTS API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock audio URL - in production, this would be from the backend
      setGeneratedAudio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    } catch (err) {
      setError('Failed to generate voiceover');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVoice({ variables: { id } });
      refetch();
    } catch (err) {
      setError('Failed to delete voice');
    }
  };

  const voices: Voice[] = data?.voices || [];

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" sx={{ 
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            VoiceDub
          </Typography>
          <Typography variant="h5" color="text.secondary">
            AI Voiceover Generator for Faceless YouTube Creators
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Main Generator Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h2" gutterBottom>
              Create Voiceover
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Enter your text"
              placeholder="Enter the text you want to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Voice</InputLabel>
                <Select
                  value={selectedVoice}
                  label="Select Voice"
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {voices.map((voice) => (
                    <MenuItem key={voice.id} value={voice.id}>
                      {voice.name} ({voice.language}, {voice.gender})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Speed: {speed}x
              </Typography>
              <Slider
                value={speed}
                onChange={(_, value) => setSpeed(value as number)}
                min={0.5}
                max={2}
                step={0.1}
                marks={[
                  { value: 0.5, label: '0.5x' },
                  { value: 1, label: '1x' },
                  { value: 1.5, label: '1.5x' },
                  { value: 2, label: '2x' },
                ]}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleGenerate}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
              sx={{ py: 1.5 }}
            >
              {isGenerating ? 'Generating...' : 'Generate Voiceover'}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Audio */}
        {generatedAudio && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Generated Voiceover
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <audio controls src={generatedAudio} style={{ flex: 1 }} />
                <IconButton color="primary" size="large">
                  <DownloadIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Voice Library */}
        <Typography variant="h2" gutterBottom>
          Voice Library
        </Typography>
        
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
            {voices.map((voice) => (
              <Card key={voice.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="h6">{voice.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {voice.language} • {voice.gender}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleDelete(voice.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {voice.previewUrl && (
                    <audio controls src={voice.previewUrl} style={{ width: '100%', marginTop: 8 }} />
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
