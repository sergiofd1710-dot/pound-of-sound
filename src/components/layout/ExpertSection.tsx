import styles from './ExpertSection.module.css';

const ITEMS = [
  {
    num: '01',
    title: 'Состояние по Goldmine',
    desc: 'M, NM, VG+, VG, G+ — точная классификация царапин, шипения, конверта',
  },
  {
    num: '02',
    title: 'Проверка подлинности',
    desc: 'Оригинальный пресс, матричные номера, страна выпуска',
  },
  {
    num: '03',
    title: 'Рыночная оценка',
    desc: 'Актуальная цена по данным аукционов и реальных сделок',
  },
];

export function ExpertSection() {
  return (
    <section className={styles.section} id="expert">
      <div>
        <div className={styles.eyebrow}>Для коллекционеров</div>
        <h2 className={styles.heading}>
          Экспертная
          <br />
          <em>оценка</em>
          <br />
          пластинок
        </h2>
        <p className={styles.body}>
          ИИ и живые эксперты оценят состояние, подлинность и рыночную
          стоимость вашей пластинки по стандарту Goldmine.
        </p>
        {/* Рабочая ИИ-оценка подключается в Фазе 2 (Edge Function). */}
        <span className={styles.soon}>ИИ-оценка — скоро</span>
      </div>

      <div className={styles.right}>
        {ITEMS.map((item) => (
          <div className={styles.item} key={item.num}>
            <div className={styles.num}>{item.num}</div>
            <div>
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.itemDesc}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
