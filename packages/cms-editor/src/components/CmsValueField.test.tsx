import type { MapStringString } from '@axonivy/cms-editor-protocol';
import { screen } from '@testing-library/react';
import { customRender } from '../context/test-utils/test-utils';
import { CmsValueField } from './CmsValueField';

test('state', () => {
  const view = renderCmsValueField({});
  expect(screen.getByLabelText('English')).toHaveValue('');
  expect(screen.getByLabelText('English')).toHaveAttribute('placeholder', '[no value]');
  expect(screen.getByRole('button')).toBeDisabled();

  view.rerenderWithValues({ en: '' });
  expect(screen.getByLabelText('English')).toHaveValue('');
  expect(screen.getByLabelText('English')).not.toHaveAttribute('placeholder', expect.anything());
  expect(screen.getByRole('button')).toBeEnabled();

  view.rerenderWithValues({ en: 'value' });
  expect(screen.getByLabelText('English')).toHaveValue('value');
  expect(screen.getByLabelText('English')).not.toHaveAttribute('placeholder', expect.anything());
  expect(screen.getByRole('button')).toBeEnabled();
});

test('readonly', () => {
  renderCmsValueField({}, true);

  expect(screen.getByLabelText('English')).toBeDisabled();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

const renderCmsValueField = (values: MapStringString, readonly?: boolean) => {
  const ui = (values: MapStringString) => (
    <CmsValueField values={values} updateValue={() => {}} deleteValue={() => {}} label='English' languageTag='en' />
  );
  const view = customRender(ui(values), {
    wrapperProps: {
      readonlyContext: { readonly },
      appContext: { languageDisplayName: new Intl.DisplayNames(['en'], { type: 'language' }) }
    }
  });
  return { ...view, rerenderWithValues: (values: MapStringString) => view.rerender(ui(values)) };
};
