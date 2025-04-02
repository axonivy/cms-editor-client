import { fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { customRender } from '../context/test-utils/test-utils';
import { CmsValueField } from './CmsValueField';

test('value state', () => {
  renderCmsValueField();

  expect(screen.getByLabelText('English')).toHaveValue('');
  expect(screen.getByLabelText('English')).toHaveAttribute('placeholder', '[no value]');
  expect(screen.getByRole('button')).toBeDisabled();

  fireEvent.change(screen.getByLabelText('English'), { target: { value: 'value' } });
  expect(screen.getByLabelText('English')).toHaveValue('value');
  expect(screen.getByLabelText('English')).not.toHaveAttribute('placeholder', expect.anything());
  expect(screen.getByRole('button')).toBeEnabled();

  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByLabelText('English')).toHaveValue('');
  expect(screen.getByLabelText('English')).toHaveAttribute('placeholder', '[no value]');
  expect(screen.getByRole('button')).toBeDisabled();
});

test('readonly', () => {
  renderCmsValueField(true);

  expect(screen.getByLabelText('English')).toBeDisabled();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

const renderCmsValueField = (readonly?: boolean) => {
  return customRender(<TestWrapper />, {
    wrapperProps: {
      readonlyContext: { readonly },
      appContext: { languageDisplayName: new Intl.DisplayNames(['en'], { type: 'language' }) }
    }
  });
};

const TestWrapper = () => {
  const [values, setValues] = useState({});
  return <CmsValueField values={values} setValues={setValues} languageTag='en' />;
};
