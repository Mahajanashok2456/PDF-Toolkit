import React from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import FileUploader from './FileUploader';

test('renders file uploader', () => {
  const mockOnFilesSelect = jest.fn();
  render(<FileUploader onFilesSelect={mockOnFilesSelect} />);
  expect(screen.getByText(/Drop PDF files here or click to upload/i)).toBeInTheDocument();
});

test('calls onFilesSelect when file is selected via input', () => {
  const mockOnFilesSelect = jest.fn();
  render(<FileUploader onFilesSelect={mockOnFilesSelect} />);
  const fileInput = screen.getByTestId('file-input');
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  fireEvent.change(fileInput, { target: { files: [file] } });
  expect(mockOnFilesSelect).toHaveBeenCalledWith(file);
});

test('calls onFilesSelect when file is dropped', () => {
  const mockOnFilesSelect = jest.fn();
  render(<FileUploader onFilesSelect={mockOnFilesSelect} />);
  const dropZone = screen.getByText(/Drop PDF files here or click to upload/i).closest('div');
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  
  // Mock dataTransfer
  const dropEvent = createEvent.drop(dropZone);
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: {
      files: [file]
    }
  });
  
  fireEvent(dropZone, dropEvent);
  expect(mockOnFilesSelect).toHaveBeenCalledWith(file);
});

test('calls onFilesSelect with array when multiple files are dropped and multiple is true', () => {
  const mockOnFilesSelect = jest.fn();
  render(<FileUploader onFilesSelect={mockOnFilesSelect} multiple={true} />);
  const dropZone = screen.getByText(/Drop PDF files here or click to upload/i).closest('div');
  const file1 = new File(['content1'], 'test1.pdf', { type: 'application/pdf' });
  const file2 = new File(['content2'], 'test2.pdf', { type: 'application/pdf' });
  
  const files = [file1, file2];
  // Make it iterable like a FileList
  files.item = (index) => files[index];
  
  const dropEvent = createEvent.drop(dropZone);
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: {
      files: files
    }
  });
  
  fireEvent(dropZone, dropEvent);
  expect(mockOnFilesSelect).toHaveBeenCalledWith(expect.arrayContaining([file1, file2]));
});

test('shows error when invalid file type is dropped', () => {
  const mockOnFilesSelect = jest.fn();
  render(<FileUploader onFilesSelect={mockOnFilesSelect} />);
  const dropZone = screen.getByText(/Drop PDF files here or click to upload/i).closest('div');
  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  
  const dropEvent = createEvent.drop(dropZone);
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: {
      files: [file]
    }
  });
  
  fireEvent(dropZone, dropEvent);
  expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
  expect(mockOnFilesSelect).not.toHaveBeenCalled();
});
