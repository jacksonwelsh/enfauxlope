/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
*/
import React from "react";
import { useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ComboBox = ({selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = React.useState(undefined)
  const [query, setQuery] = useState("")

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/categories`)
    .then((r) => r.json())
    .then((c) => setCategories(c))
  }, [])

  //React.useEffect(() => console.log(selectedCategory), [selectedCategory])

  // React.useEffect(() => {export const getSelectedCategory = () => { return selectedCategory; }}

  // function getSelectedCategory = () => {return selectedCategory} 

  // React.useEffect(() => {return selectedCategory})

  // export const getSelectedCategory = () => {return selectedCategory; }


  const filteredCats =
    query === undefined
      ? categories
      : categories?.filter((category) => {
          return category?.external.toLowerCase().includes(query?.toLowerCase())
        })

  return (
    <Combobox as="div" value={selectedCategory} onChange={setSelectedCategory}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">Add new</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(category) => category?.external}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-50" aria-hidden="true" />
        </Combobox.Button>

        {filteredCats?.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredCats?.map((category) => (
              <Combobox.Option
                name={category?.external}
                key={category?.id}
                value={category}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-200'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>{category.external}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

// export const viewDetials = () => {}
// export default function({infinite}) {}
export default ComboBox;
