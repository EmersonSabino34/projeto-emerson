import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import type { Goal } from "@/lib/data";

/**
 * A linha de objetivo da Home e de "Meus Objetivos": miniatura, título,
 * área · prazo e a barra de progresso.
 *
 * Antes cada tela tinha a sua cópia do markup; a barra entrou nas duas de
 * uma vez por isso.
 */
export default function GoalRow({ goal, delay }: { goal: Goal; delay?: number }) {
  return (
    <Link href={`/objetivos/${goal.id}`} className="goal-row">
      <span
        className="goal-thumb"
        style={{ backgroundImage: `url(${goal.image})` }}
        aria-hidden="true"
      />
      <span className="goal-body">
        <strong>{goal.title}</strong>
        <span className="goal-meta">
          {goal.category} · {goal.deadline}
        </span>
        <ProgressBar value={goal.progress} small delay={delay} />
      </span>
      <span className="goal-percent">{goal.progress}%</span>
    </Link>
  );
}
