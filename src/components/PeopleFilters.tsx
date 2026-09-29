import { Link, useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { getSearchWith } from '../utils/searchHelper';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sex = searchParams.get('sex') || '';
  const queryValue = searchParams.get('query') || '';
  const centuriesSelected = searchParams.getAll('centuries') || [];
  const sort = searchParams.get('sort') || '';
  const order = searchParams.get('order') || '';

  const handleQueryChange = (value: string) => {
    const search = getSearchWith(searchParams, { query: value ? value : null });

    setSearchParams(search);
  };

  const getUpdatedCenturies = (newCentury: string) => {
    return centuriesSelected.includes(newCentury)
      ? centuriesSelected.filter(century => century !== newCentury)
      : [...centuriesSelected, newCentury];
  };

  const getNewCenturyAddress = (century: string) => {
    return {
      pathname: '/people',
      search: getSearchWith(searchParams, {
        centuries: getUpdatedCenturies(century),
      }),
    };
  };

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <Link
          className={cn({ 'is-active': sex === '' })}
          to={{ pathname: '/people' }}
        >
          All
        </Link>
        <Link
          className={cn({ 'is-active': sex === 'm' })}
          to={{
            pathname: '/people',
            search: getSearchWith(searchParams, { sex: 'm' }),
          }}
        >
          Male
        </Link>
        <Link
          className={cn({ 'is-active': sex === 'f' })}
          to={{
            pathname: '/people',
            search: getSearchWith(searchParams, { sex: 'f' }),
          }}
        >
          Female
        </Link>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={queryValue}
            onChange={event => handleQueryChange(event.target.value)}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {['16', '17', '18', '19', '20'].map(century => (
              <Link
                key={century}
                data-cy="century"
                className={cn('button mr-1', {
                  'is-info': centuriesSelected.includes(century),
                })}
                to={getNewCenturyAddress(century)}
              >
                {century}
              </Link>
            ))}
          </div>

          <div className="level-right ml-4">
            <Link
              data-cy="centuryALL"
              className={cn('button is-success', {
                'is-outlined': centuriesSelected.length,
              })}
              to={{
                pathname: '/people',
                search: getSearchWith(searchParams, { centuries: [] }),
              }}
            >
              All
            </Link>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <Link
          className="button is-link is-outlined is-fullwidth"
          to={{
            pathname: '/people',
            search: getSearchWith(new URLSearchParams(), {
              sort: sort ? sort : null,
              order: order ? order : null,
            }),
          }}
        >
          Reset all filters
        </Link>
      </div>
    </nav>
  );
};
