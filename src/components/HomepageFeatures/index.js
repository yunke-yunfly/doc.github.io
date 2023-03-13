import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '使用简单',
    Svg: require('@site/static/img/icon_jiandan.svg').default,
    description: (
      <>
        Yunfly 从一开始从一开始就被设计为易于安装并使用的 Node.js WEB 框架。
      </>
    ),
  },
  {
    title: '性能优异',
    Svg: require('@site/static/img/icon_gaoxiao.svg').default,
    description: (
      <>
        框架底层使用 koa 框架, 性能表现优异。使用 routing-controllers 为底层路由库, 给你更好的开发体验。
      </>
    ),
  },
  {
    title: '健壮全面',
    Svg: require('@site/static/img/icon_kuaisu.svg').default,
    description: (
      <>
        框架有完善的错误处理机制,让你更关注于逻辑的开发。 强大的插件模型赋予你更多的能力。
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
