/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import AuthProtected from './AuthProtected'
import Layout from './Layout'

function Dashboard(props) {
  return (
    <AuthProtected>
      <Layout>
        <section css={styles.grid}>
          <aside
            css={css`
              padding-top: 60px;
            `}
          >
            <nav css={styles.sideNav}>
              <MenuItem to="/profile/bookings">My Bookings</MenuItem>
              <MenuItem to="/profile/items">My Items</MenuItem>
              <MenuItem to="/profile/pending-bookings">
                Pending Bookings
              </MenuItem>
            </nav>
          </aside>
          <main>{props.children}</main>
        </section>
      </Layout>
    </AuthProtected>
  )
}

const styles = {
  grid: css`
    display: grid;
    grid-template-columns: 300px auto;
    column-gap: 2rem;
  `,
  sideNav: css`
    position: sticky;
    top: 70px;
    border-radius: 6px;
    padding: 1.5rem 1rem;
    background-color: #f5f9f9;
    min-height: 400px;
  `,
  menuItem: css`
    display: inline-flex;
    width: 100%;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    text-decoration: none;
    color: #767677;
  `,
}

function MenuItem(props) {
  return <Link css={styles.menuItem} {...props} />
}

export default Dashboard
