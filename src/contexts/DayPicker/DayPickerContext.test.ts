/* eslint-disable testing-library/render-result-naming-convention */

import { es } from 'date-fns/locale';
import { DayPickerProps } from 'DayPicker';

import { renderDayPickerHook } from 'test/render';
import { freezeBeforeAll } from 'test/utils';

import { CaptionLayout } from 'components/Caption';
import { DayPickerContextValue, useDayPicker } from 'contexts/DayPicker';
import {
  DefaultContextProps,
  getDefaultContextValues
} from 'contexts/DayPicker/defaultContextValues';
import { DaySelectionMode } from 'types/DayPickerBase';
import { Formatters } from 'types/Formatters';
import { Labels } from 'types/Labels';
import {
  DayModifiers,
  InternalModifier,
  ModifiersClassNames
} from 'types/Modifiers';
import { ClassNames, Styles } from 'types/Styles';

const today = new Date(2022, 5, 13);
const defaults = getDefaultContextValues();

freezeBeforeAll(today);

function renderHook(props?: DayPickerProps) {
  return renderDayPickerHook<DayPickerContextValue>(useDayPicker, props);
}

describe('when rendered without props', () => {
  const testPropNames = Object.keys(defaults).filter(
    (key) =>
      !['today', 'formatClassNames', 'formatModifiersClassNames'].includes(key)
  ) as DefaultContextProps[];
  test.each(testPropNames)('should use the %s default value', (propName) => {
    const result = renderHook();
    expect(result.current[propName]).toEqual(defaults[propName]);
  });
});
describe('when passing "locale" from props', () => {
  const locale = es;
  test('should return the custom locale', () => {
    const result = renderHook({ locale });
    expect(result.current.locale).toBe(locale);
  });
});

describe('when passing "numberOfMonths" from props', () => {
  const numberOfMonths = 4;
  test('should return the custom numberOfMonths', () => {
    const result = renderHook({ numberOfMonths });
    expect(result.current.numberOfMonths).toBe(4);
  });
});

describe('when passing "today" from props', () => {
  const today = new Date(2010, 9, 11);
  test('should return the custom "today"', () => {
    const result = renderHook({ today });
    expect(result.current.today).toBe(today);
  });
});

describe('when passing "captionLayout" from props', () => {
  const captionLayout: CaptionLayout = 'dropdown';
  const fromYear = 2000;
  const toYear = 2010;
  const dayPickerProps: DayPickerProps = { captionLayout, fromYear, toYear };
  test('should return the custom "captionLayout"', () => {
    const result = renderHook(dayPickerProps);
    expect(result.current.captionLayout).toBe(captionLayout);
  });
});

describe('when "fromDate" and "toDate" are undefined', () => {
  const fromDate = undefined;
  const toDate = undefined;
  describe('when using "dropdown" as "captionLayout"', () => {
    const captionLayout: CaptionLayout = 'dropdown';
    test('should return "buttons" as "captionLayout"', () => {
      const result = renderHook({
        fromDate,
        toDate,
        captionLayout
      });
      expect(result.current.captionLayout).toBe('buttons');
    });
  });
});

describe('when "fromDate" is undefined, but not "toDate"', () => {
  const fromDate = undefined;
  const toDate = new Date();

  describe('when using "dropdown" as "captionLayout"', () => {
    const captionLayout: CaptionLayout = 'dropdown';
    test('should return "buttons" as "captionLayout"', () => {
      const result = renderHook({
        fromDate,
        toDate,
        captionLayout
      });
      expect(result.current.captionLayout).toBe('buttons');
    });
  });
});

describe('when "toDate" is undefined, but not "fromDate"', () => {
  const fromDate = new Date();
  const toDate = undefined;

  describe('when using "dropdown" as "captionLayout"', () => {
    const captionLayout: CaptionLayout = 'dropdown';
    test('should return "buttons" as "captionLayout"', () => {
      const result = renderHook({
        fromDate,
        toDate,
        captionLayout
      });
      expect(result.current.captionLayout).toBe('buttons');
    });
  });
});

describe('when using "dropdown" as "captionLayout"', () => {
  const captionLayout: CaptionLayout = 'dropdown';
  const fromYear = 2000;
  const toYear = 2010;
  test('should return the custom "captionLayout"', () => {
    const result = renderHook({ captionLayout, fromYear, toYear });
    expect(result.current.captionLayout).toBe(captionLayout);
  });
});

describe('when passing "modifiers" from props', () => {
  const modifiers: DayModifiers = { foo: new Date() };
  test('should return the custom "modifiers"', () => {
    const result = renderHook({ modifiers });
    expect(result.current.modifiers).toStrictEqual(modifiers);
  });
});

describe('when passing "modifiersClassNames" from props', () => {
  const modifiersClassNames: ModifiersClassNames = { foo: 'bar' };
  test('should return the custom "modifiersClassNames"', () => {
    const result = renderHook({ modifiersClassNames });
    expect(result.current.modifiersClassNames).toStrictEqual(
      modifiersClassNames
    );
  });
});

describe('when passing "formatModifiersClassNames" from props', () => {
  test('should call "formatClassNames" to "modifiersClassNames"', () => {
    const formatModifiersClassNames = jest.fn();
    const modifiersClassNames: ModifiersClassNames = { foo: 'bar' };
    const result = renderHook({
      formatModifiersClassNames,
      modifiersClassNames
    });
    expect(result.current.formatModifiersClassNames).toHaveBeenCalledTimes(1);

    expect(result.current.formatModifiersClassNames).toHaveBeenCalledWith({
      ...defaults.modifiersClassNames,
      ...modifiersClassNames
    });
  });

  test('should format "modifiersClassNames" with "formatModifiersClassNames"', () => {
    const prefix = 'custom_';
    const formatModifiersClassNames = (
      modifiersClassNames: ModifiersClassNames
    ) =>
      Object.keys(modifiersClassNames).reduce((obj, cur) => {
        obj[cur] = prefix + modifiersClassNames[cur];
        return obj;
      }, {} as ModifiersClassNames);

    const modifiersClassNames: ModifiersClassNames = {
      foo: 'bar',
      [InternalModifier.Disabled]: 'disabled'
    };
    const result = renderHook({
      formatModifiersClassNames,
      modifiersClassNames
    });

    expect(result.current.modifiersClassNames).toStrictEqual(
      formatModifiersClassNames({
        ...defaults.modifiersClassNames,
        ...modifiersClassNames
      })
    );

    expect(result.current.modifiersClassNames.disabled).toEqual(
      prefix + modifiersClassNames.disabled
    );

    expect(result.current.modifiersClassNames.foo).toEqual(
      prefix + modifiersClassNames.foo
    );
  });
});

describe('when passing "styles" from props', () => {
  const styles: Styles = { caption: { color: 'red ' } };
  test('should include the custom "styles"', () => {
    const result = renderHook({ styles });
    expect(result.current.styles).toStrictEqual({
      ...defaults.styles,
      ...styles
    });
  });
});

describe('when passing "classNames" from props', () => {
  const classNames: ClassNames = { caption: 'foo' };
  test('should include the custom "classNames"', () => {
    const result = renderHook({ classNames });
    expect(result.current.classNames).toStrictEqual({
      ...defaults.classNames,
      ...classNames
    });
  });
});

describe('when passing "formatClassNames" from props', () => {
  test('should call "formatClassNames" to "classNames"', () => {
    const formatClassNames = jest.fn();
    const classNames: ClassNames = { caption: 'foo' };
    const result = renderHook({ formatClassNames, classNames });
    expect(result.current.formatClassNames).toHaveBeenCalledTimes(1);

    expect(result.current.formatClassNames).toHaveBeenCalledWith({
      ...defaults.classNames,
      ...classNames
    });
  });

  test('should format "classNames" with "formatClassNames"', () => {
    type Writeable<T> = {
      -readonly [P in keyof T]: T[P];
    };

    const prefix = 'custom_';
    const formatClassNames = (classNames: ClassNames) =>
      Object.keys(classNames).reduce((obj, cur) => {
        obj[cur as keyof ClassNames] =
          prefix + classNames[cur as keyof ClassNames];
        return obj;
      }, {} as Writeable<Required<ClassNames>>);

    const classNames: ClassNames = { caption: 'foo' };
    const result = renderHook({ formatClassNames, classNames });

    expect(result.current.classNames).toStrictEqual(
      formatClassNames({
        ...defaults.classNames,
        ...classNames
      })
    );

    expect(result.current.classNames.root).toEqual(
      prefix + defaults.classNames.root
    );

    expect(result.current.classNames.caption).toEqual(
      prefix + classNames.caption
    );
  });
});

describe('when passing "formatters" from props', () => {
  const formatters: Partial<Formatters> = { formatCaption: jest.fn() };
  test('should include the custom "formatters"', () => {
    const result = renderHook({ formatters });
    expect(result.current.formatters).toStrictEqual({
      ...defaults.formatters,
      ...formatters
    });
  });
});

describe('when passing "labels" from props', () => {
  const labels: Partial<Labels> = { labelDay: jest.fn() };
  test('should include the custom "labels"', () => {
    const result = renderHook({ labels });
    expect(result.current.labels).toStrictEqual({
      ...defaults.labels,
      ...labels
    });
  });
});

describe('when passing an "id" from props', () => {
  test('should return the id', () => {
    const result = renderHook({ id: 'foo' });
    expect(result.current.id).toBe('foo');
  });
});

describe('when in selection mode', () => {
  const mode: DaySelectionMode = 'multiple';
  const onSelect = jest.fn();
  test('should return the "onSelect" event handler', () => {
    const result = renderHook({ mode, onSelect });
    expect(result.current.onSelect).toBe(onSelect);
  });
});
