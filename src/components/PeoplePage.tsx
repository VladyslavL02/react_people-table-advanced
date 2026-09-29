import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';
import { useEffect, useState } from 'react';
import { Person } from '../types';
import { getPeople } from '../api';

function getFullPeopleDetails(people: Person[]) {
  return people.map(person => {
    const updatedPerson = { ...person };

    if (person.fatherName) {
      const father = people.find(
        parentPerson => parentPerson.name === person.fatherName,
      );

      if (father) {
        updatedPerson.father = father;
      }
    }

    if (person.motherName) {
      const mother = people.find(
        parentPerson => parentPerson.name === person.motherName,
      );

      if (mother) {
        updatedPerson.mother = mother;
      }
    }

    return updatedPerson;
  });
}

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPeople()
      .then(data => {
        const fullPeopleDetails = getFullPeopleDetails(data);

        setPeople(fullPeopleDetails);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            {!isLoading && <PeopleFilters />}
          </div>

          <div className="column">
            <div className="box table-container">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {error && (
                    <p data-cy="peopleLoadingError">Something went wrong</p>
                  )}

                  {!error && !people?.length && (
                    <p data-cy="noPeopleMessage">
                      There are no people on the server
                    </p>
                  )}

                  {people.length === 0 && (
                    <p>
                      There are no people matching the current search criteria
                    </p>
                  )}

                  {people.length > 0 && <PeopleTable people={people} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
