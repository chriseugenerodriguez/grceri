import { HomeCarousel } from '@/components/original-surfaces';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductRow, SearchForm } from '@/components/shared';
import { useCatalog } from '@/lib/state';
import '../home-original.css';
export function HomePage() {
 const { products, entries } = useCatalog(); const [more, setMore] = useState(false);
 const main = entries.filter(e => !e.parents.length);
 return <div className="original-home"><section className="app-viewer">
  <div className="app-viewer-stripes"></div>
  <div className="app-viewer__container container">
    <div className="app-viewer__container__content">

      <h1 className="app-viewer__container__content-title">The new standard in grocery shopping.</h1>
      <p className="app-viewer__container__content-desc">Grceri is the best solution for searching all your favorite food
        products
        online. Explore a sample catalog, search by name or brand, and compare products. Prices are snapshots for this preview.</p>
      <SearchForm large />
    </div>

  </div>
</section>

<section className="groceries__illustrations">
  <div className="groceries__illustrations__one">
    <div className="groceries__illustrations__one-one"></div>
    <div className="groceries__illustrations__one-two"></div>
    <div className="groceries__illustrations__one-three"></div>
    <div className="groceries__illustrations__one-four"></div>
    <div className="groceries__illustrations__one-five"></div>
    <div className="groceries__illustrations__one-six"></div>
    <div className="groceries__illustrations__one-seven"></div>
    <div className="groceries__illustrations__one-eight"></div>
    <div className="groceries__illustrations__one-nine"></div>
  </div>
  <section className="groceries__illustrations__sub-header">
    <div className="container">
      <ul className="groceries__illustrations__sub-header__list">
        <li className="groceries__illustrations__sub-header__list__item">
          <h3 className="groceries__illustrations__sub-header__list__item-title">Search every food product online:</h3>
          <p className="groceries__illustrations__sub-header__list__item-desc">Automated shopping experience for returning
            customers. Shop for the same things, always get the best price. Vendors don't matter anymore.</p>
        </li>
        <li className="groceries__illustrations__sub-header__list__item">
          <div className="groceries__illustrations__sub-header__list__item__case">
            <h4 className="groceries__illustrations__sub-header__list__item__case-title">Best Deals</h4>
            <p className="groceries__illustrations__sub-header__list__item__case-desc">We look for the best prices and put
              it in one place.</p>
          </div>
        </li>
        <li className="groceries__illustrations__sub-header__list__item">
          <div className="groceries__illustrations__sub-header__list__item__case">
            <h4 className="groceries__illustrations__sub-header__list__item__case-title">Multiple Vendors</h4>
            <p className="groceries__illustrations__sub-header__list__item__case-desc">We take the hassle out of price
              comparison for different
              vendors.</p>
          </div>
        </li>
        <li className="groceries__illustrations__sub-header__list__item">
          <div className="groceries__illustrations__sub-header__list__item__case">
            <h4 className="groceries__illustrations__sub-header__list__item__case-title">Online Convenience</h4>
            <p className="groceries__illustrations__sub-header__list__item__case-desc">One website will never have the
              lowest price for their products,
              until
              now.</p>
          </div>
        </li>
      </ul>
      <a className="groceries__illustrations__sub-header-link" href="/groceries/all">Discover how our features can start
        saving you
        money <span aria-hidden="true">?</span></a>
    </div>
    <section className="groceries__illustrations__sub-header__recommendations">
      <div className="container">
        <HomeCarousel title="Explore the sample catalog" titleClassName="groceries__illustrations__sub-header__recommendations-title" products={products.slice(0, 14)} />
      </div>
    </section>
  </section>
</section>

<section className="container category text-center">
  <div className="category__content">
    <h3 className="category__content-title">Build a grocery list from the best source</h3>
    <p className="category__content-desc">At Grceri. You will be able to set custom preferences based on your diet, with a
      bunch of goodies included.</p>
    <ul className="category__content__lists">
      <li className="category__content__lists__list">
        <strong>Food Analytics</strong>
        <p>Chart analysis of recommended daily intake and any incongruences from your product lists.</p>
      </li>
      <li className="category__content__lists__list">
        <strong>Diet & Analysis</strong>
        <p>Different diet categorical charts to analyze your product lists.</p>
      </li>
      <li className="category__content__lists__list">
        <strong>Diet Congruence</strong>
        <p>Based on your dietary needs and restrictions, approve or deny any product you view.</p>
      </li>
    </ul>
    <div className="category__content-btn"><Button variant="secondary" onClick={() => setMore(!more)}>{more ? 'Less' : 'More'}</Button>{more && <Button asChild><Link to="/groceries">See all Categories</Link></Button>}</div>
  </div>

  <ul className="category__list">{main.slice(0, more ? main.length : 12).map(e => <li className="category__list__item" key={e.node.id}><Link className="category__list__item__link" to={e.path}><i aria-hidden="true" className={`category__list__item__link-img-${e.node.class} category__list__item__link-img`} /><h4 className="category__list__item__link-title">{e.node.name}</h4></Link></li>)}</ul>
</section>

<section className="popular">
  <div className="container">
    <HomeCarousel title="More groceries to explore" titleClassName="popular-title" products={products.slice(14, 28)} />
  </div>
</section>



<section className="cta">
  <div className="container">
    <div className="row">
      <div className="col col-md-6">
        <h3 className="cta-title">Ready to get started?</h3>
        <h4 className="cta-subtitle">Explore the sample catalog.</h4>
      </div>
      <div className="col col-md-6">
        <Button asChild><Link to="/groceries/all">Browse the demo</Link></Button>
        <Button asChild variant="secondary"><Link to="/groceries">Start Shopping</Link></Button>
      </div>
    </div>
  </div>
</section>
</div>;
}