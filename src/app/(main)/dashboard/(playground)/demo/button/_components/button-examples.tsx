"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import Button from "@/shared/components/form/button";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <h2 className="text-2xl font-semibold mb-5">{title}</h2>
    {children}
  </section>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 flex-wrap">{children}</div>
);

const ButtonExamples: React.FC = () => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleAsyncAction = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="mb-10 text-3xl font-bold">Button Component Examples</h1>

      <Section title="1. Basic Usage">
        <Row>
          <Button text="Default Button" />
          <Button>Button with Children</Button>
          <Button text="Primary" color="primary" />
          <Button text="Secondary" color="secondary" />
        </Row>
      </Section>

      <Section title="2. Loading States">
        <Row>
          <Button
            text="Click to Load"
            loading={loading1}
            onClick={() => handleAsyncAction(setLoading1)}
          />
          <Button
            text="Save Data"
            loading={loading2}
            onClick={() => handleAsyncAction(setLoading2)}
            startIcon={<SaveIcon />}
          />
          <Button
            text="Upload"
            loading={loading3}
            onClick={() => handleAsyncAction(setLoading3)}
            startIcon={<CloudUploadIcon />}
            color="success"
          />
        </Row>
      </Section>

      <Section title="3. Button Sizes">
        <div className="flex gap-3 items-center flex-wrap">
          <Button text="Small" size="small" />
          <Button text="Medium" size="medium" />
          <Button text="Large" size="large" />
        </div>
      </Section>

      <Section title="4. Color Variants">
        <Row>
          <Button text="Primary" color="primary" />
          <Button text="Secondary" color="secondary" />
          <Button text="Success" color="success" />
          <Button text="Error" color="error" />
          <Button text="Info" color="info" />
          <Button text="Warning" color="warning" />
        </Row>
      </Section>

      <Section title="5. Button Variants">
        <Row>
          <Button text="Contained" variant="contained" />
          <Button text="Outlined" variant="outlined" />
          <Button text="Text" variant="text" />
        </Row>
      </Section>

      <Section title="6. Custom Colors">
        <Row>
          <Button
            text="Custom Blue"
            backgroundColor="#3f51b5"
            textColor="#ffffff"
          />
          <Button
            text="Custom Orange"
            backgroundColor="#ff5722"
            textColor="#fff"
          />
          <Button
            text="Custom Purple"
            backgroundColor="#9c27b0"
            textColor="#ffffff"
          />
          <Button
            text="Custom Teal"
            backgroundColor="#009688"
            textColor="#ffffff"
          />
          <Button
            text="Custom Pink"
            backgroundColor="#e91e63"
            textColor="#ffffff"
          />
        </Row>
      </Section>

      <Section title="7. Buttons with Icons">
        <Row>
          <Button text="Save" startIcon={<SaveIcon />} color="primary" />
          <Button text="Delete" startIcon={<DeleteIcon />} color="error" />
          <Button text="Send" endIcon={<SendIcon />} color="success" />
          <Button text="Upload" startIcon={<CloudUploadIcon />} color="info" />
          <Button text="Add New" startIcon={<AddIcon />} variant="outlined" />
          <Button text="Edit" startIcon={<EditIcon />} variant="text" />
        </Row>
      </Section>

      <Section title="8. Disabled Buttons">
        <Row>
          <Button text="Disabled" disabled />
          <Button text="Disabled Primary" color="primary" disabled />
          <Button text="Disabled Outlined" variant="outlined" disabled />
          <Button text="Enabled" />
        </Row>
      </Section>

      <Section title="9. Full Width Buttons">
        <div className="flex flex-col gap-3">
          <Button text="Full Width Button" fullWidth />
          <Button
            text="Full Width with Icon"
            startIcon={<SaveIcon />}
            fullWidth
            color="primary"
          />
          <Button text="Full Width Outlined" variant="outlined" fullWidth />
        </div>
      </Section>

      <Section title="10. Button Groups">
        <h3 className="text-base font-medium mb-3">Form Actions</h3>
        <div className="flex gap-3 mb-6">
          <Button text="Cancel" variant="outlined" />
          <Button text="Save Draft" variant="text" />
          <Button text="Submit" color="primary" />
        </div>

        <h3 className="text-base font-medium mb-3">Confirmation Dialog</h3>
        <div className="flex justify-end gap-3">
          <Button text="Cancel" variant="text" />
          <Button
            text="Confirm Delete"
            color="error"
            startIcon={<DeleteIcon />}
          />
        </div>
      </Section>

      <Section title="11. Button Types (for Forms)">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted!");
          }}
        >
          <Row>
            <Button text="Submit (type=submit)" type="submit" />
            <Button
              text="Reset (type=reset)"
              type="reset"
              variant="outlined"
            />
            <Button
              text="Button (type=button)"
              type="button"
              variant="text"
            />
          </Row>
        </form>
      </Section>

      <Section title="12. Real-world Examples">
        <h3 className="text-base font-medium mb-3">Login Form</h3>
        <div className="max-w-sm mb-6">
          <Button text="Sign In" fullWidth size="large" color="primary" />
        </div>

        <h3 className="text-base font-medium mb-3">Data Table Actions</h3>
        <div className="flex gap-3 mb-6">
          <Button text="Add New" startIcon={<AddIcon />} color="primary" />
          <Button
            text="Export"
            startIcon={<CloudUploadIcon />}
            variant="outlined"
          />
          <Button
            text="Delete Selected"
            startIcon={<DeleteIcon />}
            color="error"
            variant="outlined"
          />
        </div>

        <h3 className="text-base font-medium mb-3">Card Actions</h3>
        <div className="border border-gray-200 rounded-lg p-4 max-w-sm">
          <h4 className="mb-2 font-semibold">Sample Card</h4>
          <p className="mb-4 text-gray-600">
            This is a sample card with action buttons.
          </p>
          <div className="flex gap-2">
            <Button
              text="Edit"
              startIcon={<EditIcon />}
              size="small"
              variant="text"
            />
            <Button
              text="Delete"
              startIcon={<DeleteIcon />}
              size="small"
              variant="text"
              color="error"
            />
          </div>
        </div>
      </Section>

      <Section title="13. Combination Examples">
        <Row>
          <Button
            text="Large with Icon"
            size="large"
            startIcon={<SaveIcon />}
            color="primary"
          />
          <Button
            text="Small Custom Color"
            size="small"
            backgroundColor="#8e24aa"
            textColor="#ffffff"
            startIcon={<AddIcon />}
          />
          <Button
            text="Outlined with End Icon"
            variant="outlined"
            endIcon={<SendIcon />}
            color="success"
          />
        </Row>
      </Section>
    </div>
  );
};

export default ButtonExamples;
