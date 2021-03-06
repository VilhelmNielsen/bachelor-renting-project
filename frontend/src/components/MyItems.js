/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import { Link } from '@reach/router'
import gql from 'graphql-tag'
import { MyItemCard } from './ItemCard'

const QUERY_MY_ITEMS = gql`
  query myItems {
    me {
      id
      items {
        id
        title
        averageRating
        maxDuration
        price
        image {
          full
          preview
        }
        bookings(where: { status: PENDING }) {
          id
        }
      }
    }
  }
`

const styles = {
  grid: css`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  `,
}

function MyItems() {
  const {
    data: { me },
  } = useQuery(QUERY_MY_ITEMS, { suspend: true })
  return (
    <section>
      <h1>My items</h1>
      <div css={styles.grid}>
        {me.items.length > 0 ? (
          me.items.map(item => <MyItemCard key={item.id} item={item} />)
        ) : (
          <p>
            You don't have any items yet,{' '}
            <Link to="/add-item">you could add some!</Link>
          </p>
        )}
      </div>
    </section>
  )
}

export default MyItems
